package SGU.CEDD._C.demo.user;

import SGU.CEDD._C.demo.user.UsuarioResponseDTO;
import SGU.CEDD._C.demo.user.UsuarioRequestDTO;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    // Inyección de dependencia a través del constructor (mejor práctica)
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // --- MÉTODOS CRUD ---

    public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO requestDTO) {
        // 1. Convertir DTO a Entity
        Usuario nuevoUsuario = new Usuario(null,
                requestDTO.getNombreCompleto(),
                requestDTO.getCorreoElectronico(),
                requestDTO.getNumeroTelefono());

        // 2. Guardar Entity en la BD
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        // 3. Convertir Entity a Response DTO
        return convertirAUsuarioResponseDTO(usuarioGuardado);
    }

    public List<UsuarioResponseDTO> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::convertirAUsuarioResponseDTO)
                .collect(Collectors.toList());
    }

    public UsuarioResponseDTO obtenerUsuarioPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        // Manejo de excepción básico

        return convertirAUsuarioResponseDTO(usuario);
    }

    public UsuarioResponseDTO actualizarUsuario(Long id, UsuarioRequestDTO requestDTO) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        // 1. Actualizar campos del Entity
        usuarioExistente.setNombreCompleto(requestDTO.getNombreCompleto());
        usuarioExistente.setCorreoElectronico(requestDTO.getCorreoElectronico());
        usuarioExistente.setNumeroTelefono(requestDTO.getNumeroTelefono());

        // 2. Guardar Entity actualizado
        Usuario usuarioActualizado = usuarioRepository.save(usuarioExistente);

        // 3. Convertir Entity a Response DTO
        return convertirAUsuarioResponseDTO(usuarioActualizado);
    }

    public void eliminarUsuario(Long id) {
        // Verificar existencia antes de eliminar (opcional, pero buena práctica)
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado para eliminar con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }


    private UsuarioResponseDTO convertirAUsuarioResponseDTO(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNombreCompleto(),
                usuario.getCorreoElectronico(),
                usuario.getNumeroTelefono()
        );
    }
}