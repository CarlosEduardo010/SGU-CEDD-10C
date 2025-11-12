package SGU.CEDD._C.demo.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequestDTO {

    // No se incluye el 'id' porque el cliente no lo envía al crear
    private String nombreCompleto;

    private String correoElectronico;

    private String numeroTelefono;
}