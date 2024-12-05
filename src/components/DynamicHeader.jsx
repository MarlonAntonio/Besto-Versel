import { useState, useEffect } from 'react';

export default function DynamicHeader() {
    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6">
            <div className="container mx-auto px-8 md:px-2">
                <div className="relative w-full md:w-72 mx-auto">
                    <div className="absolute w-full flex justify-center -top-14 md:hidden">
                        <div className="w-24 h-24">
                            <img 
                                src="/default-profile.jpg"
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover shadow-lg"
                            />
                        </div>
                    </div>
                    <div className="text-center pt-12 md:pt-0">
                        <h1 className="text-2xl font-bold mb-2">Mi Tienda Online</h1>
                        <p className="text-[10px] md:text-xs text-gray-300">Productos + Ofertas</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
