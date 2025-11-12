import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost';
const PORT = import.meta.env.VITE_API_PORT || '8000';
const BASE = import.meta.env.VITE_API_BASE || '/api/usuarios';

// Definición de tipos (si usas TypeScript)
interface Usuario {
    id: number;
    nombreCompleto: string;
    correoElectronico: string;
    numeroTelefono: string;
}

interface UsuarioRequest {
    nombreCompleto: string;
    correoElectronico: string;
    numeroTelefono: string;
}

const API_URL = `http://${HOST}:${PORT}${BASE}`;

const CRUDUsuarios = () => {
    // 1. ESTADOS PRINCIPALES
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [nuevoUsuario, setNuevoUsuario] = useState<UsuarioRequest>({ 
        nombreCompleto: '', 
        correoElectronico: '', 
        numeroTelefono: '' 
    });
    const [cargando, setCargando] = useState(true);
    
    // ESTADO PARA EDICIÓN
    const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    // ----------------------------------------------------
    // LÓGICA DE LECTURA Y CREACIÓN (GET, POST)
    // ----------------------------------------------------

    const obtenerUsuarios = async () => {
        try {
            const response = await axios.get<Usuario[]>(API_URL);
            setUsuarios(response.data);
            setCargando(false);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            setCargando(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNuevoUsuario({
            ...nuevoUsuario,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post<Usuario>(API_URL, nuevoUsuario);
            setUsuarios([...usuarios, response.data]);
            setNuevoUsuario({ 
                nombreCompleto: '', 
                correoElectronico: '', 
                numeroTelefono: '' 
            });
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    };
    
    const handleEliminar = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setUsuarios(usuarios.filter(usuario => usuario.id !== id));
        } catch (error) {
            console.error(`Error al eliminar usuario con ID ${id}:`, error);
        }
    };

    // ----------------------------------------------------
    // LÓGICA DE ACTUALIZACIÓN (PUT)
    // ----------------------------------------------------

    /** * Carga los datos de un usuario en el estado de edición y en el formulario. 
     * Esto oculta el formulario de creación y muestra el de edición.
     */
    const handleEditar = (usuario: Usuario) => {
        setUsuarioAEditar(usuario);
        // También puedes cargar los datos en el formulario de 'nuevoUsuario' si quieres usar uno solo
        // setNuevoUsuario(usuario); 
    };

    /** * Maneja los cambios en los campos del formulario de edición 
     */
    const handleChangeEditar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (usuarioAEditar) {
            setUsuarioAEditar({
                ...usuarioAEditar,
                [e.target.name]: e.target.value
            });
        }
    };

    /** * Envía la petición PUT para actualizar el usuario 
     */
    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuarioAEditar) return;

        try {
            // Aseguramos que la petición PUT contenga el ID en la URL
            const response = await axios.put<Usuario>(`${API_URL}/${usuarioAEditar.id}`, usuarioAEditar);
            
            // Actualizar el estado de la lista de usuarios con los datos modificados
            setUsuarios(usuarios.map(u => 
                u.id === usuarioAEditar.id ? response.data : u
            ));
            
            // Limpiar el estado de edición
            setUsuarioAEditar(null); 
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
        }
    };
    
    // ----------------------------------------------------

    if (cargando) {
        return <h2>Cargando usuarios...</h2>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>🚀 CRUD de Usuarios (React + Spring Boot)</h1>
            
            <hr/>
            
            {/* --- Formulario de Edición (Muestra si hay un usuario seleccionado) --- */}
            {usuarioAEditar && (
                <div style={{ border: '2px solid orange', padding: '20px', marginBottom: '40px' }}>
                    <h2>✏️ Editando Usuario ID: {usuarioAEditar.id}</h2>
                    <form onSubmit={handleActualizar}>
                        <input
                            type="text"
                            name="nombreCompleto"
                            placeholder="Nombre Completo"
                            value={usuarioAEditar.nombreCompleto}
                            onChange={handleChangeEditar}
                            required
                        />
                        <input
                            type="email"
                            name="correoElectronico"
                            placeholder="Correo Electrónico"
                            value={usuarioAEditar.correoElectronico}
                            onChange={handleChangeEditar}
                            required
                        />
                        <input
                            type="tel"
                            name="numeroTelefono"
                            placeholder="Teléfono"
                            value={usuarioAEditar.numeroTelefono}
                            onChange={handleChangeEditar}
                            required
                        />
                        <button type="submit" style={{ backgroundColor: 'orange', color: 'white' }}>Guardar Cambios</button>
                        <button type="button" onClick={() => setUsuarioAEditar(null)} style={{ marginLeft: '10px' }}>
                            Cancelar Edición
                        </button>
                    </form>
                </div>
            )}
            
            {/* --- Formulario de Creación (Se oculta si se está editando) --- */}
            {!usuarioAEditar && (
                <div style={{ marginBottom: '40px' }}>
                    <h2>➕ Crear Nuevo Usuario</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="nombreCompleto"
                            placeholder="Nombre Completo"
                            value={nuevoUsuario.nombreCompleto}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="correoElectronico"
                            placeholder="Correo Electrónico"
                            value={nuevoUsuario.correoElectronico}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="tel"
                            name="numeroTelefono"
                            placeholder="Teléfono"
                            value={nuevoUsuario.numeroTelefono}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Crear Usuario</button>
                    </form>
                </div>
            )}

            <hr/>

            {/* --- Listado de Usuarios (GET) --- */}
            <h2>📋 Lista de Usuarios</h2>
            {usuarios.length === 0 ? (
                <p>No hay usuarios registrados.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {usuarios.map(usuario => (
                        <li key={usuario.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
                            <p><strong>ID:</strong> {usuario.id}</p>
                            <p><strong>Nombre:</strong> {usuario.nombreCompleto}</p>
                            <p><strong>Email:</strong> {usuario.correoElectronico}</p>
                            <p><strong>Teléfono:</strong> {usuario.numeroTelefono}</p>
                            <button 
                                onClick={() => handleEditar(usuario)}
                                style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '5px 10px' }}
                            >
                                Editar
                            </button>
                            <button 
                                onClick={() => handleEliminar(usuario.id)}
                                style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', marginLeft: '10px' }}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CRUDUsuarios;