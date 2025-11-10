import React from 'react';

interface MapProps {
    latitude: number;
    longitude: number;
    hotelName: string;
}

const Map: React.FC<MapProps> = ({ latitude, longitude, hotelName }) => {
    // Bounding box calculation for centering the map.
    // Adjust the values to control the zoom level.
    const lon_minus = longitude - 0.02;
    const lat_minus = latitude - 0.01;
    const lon_plus = longitude + 0.02;
    const lat_plus = latitude + 0.01;

    const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon_minus},${lat_minus},${lon_plus},${lat_plus}&layer=mapnik&marker=${latitude},${longitude}`;

    return (
        <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-[#0c4b83] mb-4">Hotel Location</h3>
            <div className="rounded-md overflow-hidden border border-gray-200 h-[300px]">
                <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    src={embedUrl}
                    title={`Map of ${hotelName}`}
                    style={{ border: 0 }}
                ></iframe>
            </div>
        </div>
    );
};

export default Map;