import React from 'react';

const Logo: React.FC = () => {
    return (
        <a href="#" aria-label="Matrix Golf Holidays Home">
            <img 
                src="https://www.matrixgolfholidays.com/images/logo.png" 
                alt="Matrix Golf Holidays logo" 
                className="h-12 md:h-14 object-contain"
            />
        </a>
    );
};

export default Logo;
