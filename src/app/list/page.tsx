'use client';
import { useState, useEffect, useRef } from 'react';

export default function List() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('按我一下就加一');
    const isInitialRender = useRef(true);
    const addCount = () => {
        setCount(count => count+1);
        setCount(count => count+1);
    }
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        setName(`我已经点击了${count}次哦！！`)
    }, [count])
    return (
        <div>
            <div>我是列表</div>
            <div>我是计数器</div>
            <div>{ count }</div>
            <button onClick={addCount}>{name}</button>
        </div>
    )
}