package SGU.CEDD._C.demo.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponseDTO {

    private Long id; // Incluimos el ID en la respuesta

    private String nombreCompleto;

    private String correoElectronico;

    private String numeroTelefono;
}