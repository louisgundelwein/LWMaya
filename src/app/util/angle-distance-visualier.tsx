'use client'
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const AngleDistanceVisualizer: React.FC = () => {
    const [angleXY, setAngleXY] = useState(0);
    const [angleZ, setAngleZ] = useState(0);
    const [distance, setDistance] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        socket.on('fromSerial', (data: string) => {
            if (data.startsWith('POS:')) {
                const [, angleXY, angleZ, distance] = data.split(':');
                setAngleXY(parseFloat(angleXY));
                setAngleZ(parseFloat(angleZ));
                setDistance(parseFloat(distance));
            }
        });

        return () => {
            socket.off('fromSerial');
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw distance
                ctx.beginPath();
                ctx.arc(150, 150, distance, 0, 2 * Math.PI);
                ctx.stroke();

                // Draw angle XY
                ctx.beginPath();
                ctx.moveTo(150, 150);
                const x = 150 + distance * Math.cos((angleXY * Math.PI) / 180);
                const y = 150 + distance * Math.sin((angleXY * Math.PI) / 180);
                ctx.lineTo(x, y);
                ctx.stroke();

                // Draw angle Z
                ctx.fillText(`Angle Z: ${angleZ.toFixed(2)}°`, 10, 20);
                ctx.fillText(`Angle XY: ${angleXY.toFixed(2)}°`, 10, 40);
                ctx.fillText(`Distance: ${distance.toFixed(2)} mm`, 10, 60);
            }
        }
    }, [angleXY, angleZ, distance]);

    return <canvas ref={canvasRef} width={300} height={300} style={{ border: '1px solid white' }} />;
};

export default AngleDistanceVisualizer;
