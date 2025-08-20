"use client";
import { useEffect, useState, useCallback } from 'react';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import './page.css';

// 创建共享的Y.js文档和文本
const ydoc = new Y.Doc();
const ytext = ydoc.getText('codemirror');

// 创建WebSocket提供程序 - 这是同步的核心
const provider = new WebsocketProvider('ws://localhost:1234', 'my-room', ydoc);

function randomColor() {
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

const userInfo = {
    userId: Math.floor(Math.random() * 10000000),
    name: '用户' + Math.floor(Math.random() * 10000000),
    color: randomColor()
}

export default function Editor() {
    const [value, setValue] = useState('');
    const [users, setUsers] = useState<{ user: { name: string; color: string } }[]>([]);
    const [currentUser, setCurrentUser] = useState<{ name: string; color: string } | null>(null);
    
    // ==================== 同步修改的核心部分 ====================
    // 处理文本变化 - 使用事务确保操作的原子性
    const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText: string = event.target.value;
        const currentText: string = ytext.toString();
        
        // 计算差异并应用更改
        if (newText !== currentText) {
            // 使用事务确保原子操作 - 这是同步的关键
            ydoc.transact(() => {
                // 计算文本差异
                let i = 0;
                while (i < currentText.length && i < newText.length && currentText[i] === newText[i]) {
                    i++;
                }
                
                // 删除差异部分
                const deleteLength: number = currentText.length - i;
                if (deleteLength > 0) {
                    ytext.delete(i, deleteLength);
                }
                
                // 插入新内容
                if (i < newText.length) {
                    ytext.insert(i, newText.substring(i));
                }
            });
            // Y.js会自动通过WebSocketProvider将这些操作同步给所有连接的客户端
        }
        
        setValue(newText);
    }, []);
    // ==================== 同步修改的核心部分结束 ====================

    useEffect(() => {
        // 设置IndexedDB持久化
        const persistence = new IndexeddbPersistence('my-yjs-doc', ydoc);
        
        persistence.whenSynced.then(() => {
            console.log('文档已从IndexedDB加载');
            const storedText = ytext.toString();
            setValue(storedText);
        });

        // 设置用户信息 - 这部分也会同步给其他客户端
        provider.awareness.setLocalStateField('user', userInfo);
        
        // ==================== 监听文档变化 ====================
        // 这是接收其他客户端修改的关键
        const observer = () => {
            // 当其他客户端修改文档时，这个回调会被触发
            setValue(ytext.toString());
        };
        
        ytext.observe(observer);
        // ==================== 监听文档变化结束 ====================
        
        // 监听用户状态变化
        const updateUsers = () => {
            const states = Array.from(provider.awareness.getStates().values());
            // 识别当前用户
            const currentUser = states.find(item => {
                return item.user.userId === userInfo.userId
            });
            console.log('当前用户:', currentUser, states, userInfo.userId);
            setCurrentUser(currentUser ? { name: currentUser.user.name, color: currentUser.user.color } : null);
            setUsers(states.filter(state => state.user !== undefined).map(state => ({ user: state.user })));
        };
        
        provider.awareness.on('change', updateUsers);
        updateUsers();
        
        // 清理函数
        return () => {
            ytext.unobserve(observer);
            provider.awareness.off('change', updateUsers);
            persistence.destroy();
            provider.disconnect();
        };
    }, []);

    return (
        <div className="editor-container">
            <h1>WebSocket 协作编辑器</h1>
            
            <div className="user-list">
                {/* 当前用户信息 */}
                <div className="current-user-card">
                    <h2>👤 当前用户身份</h2>
                    <div className="user-info">
                        <span 
                            className="user-avatar" 
                            style={{ backgroundColor: currentUser?.color }}
                        >
                            {currentUser?.name}
                        </span>
                    </div>
                </div>

                <h2>在线用户 ({users.length})</h2>
                <div className="users">
                    {users.map((state, idx) => (
                        <div key={idx} className="user" style={{ color: state.user.color }}>
                            {state.user.name}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="sync-explanation">
                <h3>同步机制说明</h3>
                <p>当您在文本框中输入时，Y.js会:</p>
                <ol>
                    <li>检测文本差异</li>
                    <li>通过WebSocket将操作发送到服务器</li>
                    <li>服务器广播给所有连接的客户端</li>
                    <li>其他客户端应用相同的操作</li>
                </ol>
            </div>
            
            <textarea
                rows={15}
                onChange={handleChange}
                value={value}
                className="editor-textarea"
                placeholder="开始输入内容，其他浏览器会实时同步..."
            />
            
            <div className="stats">
                <span>字符数: {value.length}</span>
                <span>连接状态: {provider.wsconnected ? '已连接' : '断开'}</span>
                <span>房间ID: my-room</span>
            </div>
        </div>
    );
}