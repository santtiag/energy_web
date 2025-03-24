'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { isAuthenticated, login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) router.push('/dashboard');
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error en el inicio de sesión');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor');
        }
    };

    return (
        <div className="container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input               id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="correo@cecar.edu.co"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input               id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit">Iniciar Sesión</button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
    );
} 
