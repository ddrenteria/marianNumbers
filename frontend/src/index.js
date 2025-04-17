// Error Modal Component
function ErrorModal({ message, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3 className="modal-title">Error</h3>
                <p className="modal-message">{message}</p>
                <button className="modal-button" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}

// Calculation History Component
function CalculationHistory({ history, onDelete, onReuse }) {
    return (
        <div className="history-container">
            <h4 className="history-title">Historial de Cálculos</h4>
            {history.map((item, index) => (
                <div key={index} className="history-item">
                    <span className="history-text">{item.text}</span>
                    <span className="history-value">{item.value}</span>
                    <div className="history-actions">
                        <button className="history-button" onClick={() => onReuse(item)}>↺</button>
                        <button className="history-button" onClick={() => onDelete(index)}>×</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Mystical Guide Component
function MysticalGuide() {
    return (
        <div className="mystical-guide">
            <span>?</span>
        </div>
    );
}

// Sound handling
const backgroundMusic = new Audio('./assets/sdv.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

// Sound Toggle Component
function SoundToggle({ isEnabled, onToggle }) {
    return (
        <div className="sound-toggle" onClick={onToggle}>
            {isEnabled ? '🔊' : '🔇'}
        </div>
    );
}

// LoginView Component
function LoginView({ onLogin }) {
    const [key, setKey] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(key);
    };

    return (
        <div>
            <h2 className="title glow-text">Ingrese su Clave</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Clave"
                    className="glow-border"
                />
                <button type="submit" className="pulse">Ingresar</button>
            </form>
        </div>
    );
}

// MainView Component
function MainView({ onLogout, onCalculate, history, onDeleteHistory, onReuseCalculation }) {
    const [text, setText] = React.useState('');
    const [result, setResult] = React.useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            const value = onCalculate(text);
            setResult(value);
            setText('');
        }
    };

    return (
        <div>
            <h2 className="title glow-text">Calculadora Esotérica</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ingrese texto"
                    className="glow-border"
                />
                <button type="submit" className="pulse">Calcular</button>
            </form>
            
            {result !== null && (
                <div className="result pulse">
                    Valor: {result}
                </div>
            )}
            
            <CalculationHistory 
                history={history}
                onDelete={onDeleteHistory}
                onReuse={onReuseCalculation}
            />
            
            <button onClick={onLogout} style={{ marginTop: '1rem' }}>Salir</button>
        </div>
    );
}

// App Component
function App() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [calculationHistory, setCalculationHistory] = React.useState([]);
    const [soundEnabled, setSoundEnabled] = React.useState(true);
    const [soundInitialized, setSoundInitialized] = React.useState(false);

    // Referencias para los contenedores
    const containerRef = React.useRef(null);

    // Efecto para inicializar elementos visuales
    React.useEffect(() => {
        if (containerRef.current) {
            // Crear símbolos místicos
            window.createMysticalSymbols(containerRef.current);
            
            // Crear constelación
            window.createConstellation(containerRef.current);
        }
    }, [isLoggedIn]);

    // Efecto para manejar el sonido
    React.useEffect(() => {
        if (soundEnabled && !soundInitialized) {
            // Try to play the music on first user interaction
            const playMusic = () => {
                backgroundMusic.play()
                    .then(() => {
                        setSoundInitialized(true);
                        // Remove the event listener after successful play
                        document.removeEventListener('click', playMusic);
                    })
                    .catch(err => console.log('Music playback failed:', err));
            };
            
            // Add event listener for first user interaction
            document.addEventListener('click', playMusic);
            
            // Cleanup function
            return () => {
                document.removeEventListener('click', playMusic);
            };
        } else if (soundEnabled && soundInitialized) {
            backgroundMusic.play().catch(err => console.log('Music playback failed:', err));
        } else {
            backgroundMusic.pause();
        }
    }, [soundEnabled, soundInitialized]);

    const handleLogin = (key) => {
        if (key === '333') {
            setIsLoggedIn(true);
        } else {
            setError('Clave incorrecta. Por favor, intente nuevamente.');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    const handleCalculate = (text) => {
        // Calcular el valor numérico
        const value = calculateLetterValue(text);
        
        // Añadir al historial
        setCalculationHistory(prev => [
            { text, value },
            ...prev.slice(0, 9) // Mantener solo los últimos 10 cálculos
        ]);
        
        return value;
    };

    const handleDeleteHistory = (index) => {
        setCalculationHistory(prev => prev.filter((_, i) => i !== index));
    };

    const handleReuseCalculation = (item) => {
        // Aquí podrías implementar la lógica para reutilizar el cálculo
        // Por ejemplo, copiando el texto al portapapeles o mostrándolo en un input
        alert(`Reutilizando: ${item.text} = ${item.value}`);
    };

    const toggleSound = () => {
        setSoundEnabled(prev => !prev);
        // If enabling sound and not initialized, mark as initialized
        if (!soundEnabled && !soundInitialized) {
            setSoundInitialized(true);
        }
    };

    return (
        <div className="container" ref={containerRef}>
            {!isLoggedIn ? (
                <LoginView onLogin={handleLogin} />
            ) : (
                <MainView 
                    onLogout={handleLogout} 
                    onCalculate={handleCalculate}
                    history={calculationHistory}
                    onDeleteHistory={handleDeleteHistory}
                    onReuseCalculation={handleReuseCalculation}
                />
            )}
            
            {error && <ErrorModal message={error} onClose={() => setError(null)} />}
            
            <MysticalGuide />
            <SoundToggle isEnabled={soundEnabled} onToggle={toggleSound} />
        </div>
    );
}

// Función para calcular el valor de las letras
function calculateLetterValue(text) {
    const letterValues = {
        'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
        'j': 10, 'k': 11, 'l': 12, 'm': 13, 'n': 14, 'o': 15, 'p': 16, 'q': 17,
        'r': 18, 's': 19, 't': 20, 'u': 21, 'v': 22, 'w': 23, 'x': 24, 'y': 25, 'z': 26
    };
    
    return text.toLowerCase().split('').reduce((sum, char) => {
        return sum + (letterValues[char] || 0);
    }, 0);
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); 