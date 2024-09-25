import React, { useEffect } from 'react';
import './style.css'; // File CSS của bạn

function CubeRotate() {
  useEffect(() => {
    const cubes = document.querySelectorAll('.cube-span');
    cubes.forEach((cube, index) => {
      const spanElement = cube as HTMLElement; // Chuyển đổi cube thành HTMLElement
      spanElement.style.setProperty('--i', index.toString());
    });
  }, []);

  return (
    <div className="cube-loader">
      <div className="cube-top"></div>
      <div className="cube-wrapper">
        {[0, 1, 2, 3].map(index => (
          <span key={index} className="cube-span"></span>
        ))}
      </div>
    </div>
  );
}

export default CubeRotate;
