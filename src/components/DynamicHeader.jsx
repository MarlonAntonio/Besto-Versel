import { useState, useEffect } from 'react';
import { headerConfig as defaultConfig } from '../config/header';

export default function DynamicHeader() {
    const [config, setConfig] = useState(defaultConfig);

    useEffect(() => {
        // Cargar configuración inicial
        const savedConfig = localStorage.getItem('headerConfig');
        if (savedConfig) {
            try {
                setConfig(JSON.parse(savedConfig));
            } catch (error) {
                console.error('Error loading header config:', error);
            }
        }

        // Escuchar cambios en la configuración
        const handleConfigUpdate = () => {
            const updatedConfig = localStorage.getItem('headerConfig');
            if (updatedConfig) {
                try {
                    setConfig(JSON.parse(updatedConfig));
                } catch (error) {
                    console.error('Error updating header config:', error);
                }
            }
        };

        window.addEventListener('headerConfigUpdated', handleConfigUpdate);
        return () => window.removeEventListener('headerConfigUpdated', handleConfigUpdate);
    }, []);

    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6">
            <div className="container mx-auto px-8 md:px-2">
                <div className="relative w-full md:w-72 mx-auto">
                    <div className="absolute w-full flex justify-center -top-14 md:hidden">
                        <div className="w-24 h-24">
                            <img 
                                src={config.profileImage}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover shadow-lg"
                            />
                        </div>
                    </div>
                    <div className="text-center pt-12 md:pt-0">
                        <h1 className="text-2xl font-bold mb-2">{config.title}</h1>
                        <p className="text-[10px] md:text-xs text-gray-300">{config.subtitle}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
