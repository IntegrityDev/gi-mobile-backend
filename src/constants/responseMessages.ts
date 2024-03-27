const RESPONSE_MESSAGES = {
    USER_EXISTS: 'Ya existe un usuario con esa identificación.',
    WRONG_LOGIN: 'La identificación o contraseña son incorrectas.',
    PASSWORD_CHANGED: 'La contraseña se ha cambiado correctamente.',
    PASSWORD_NOT_CHANGE: 'No se pudo cambiar la contraseña. Por favor, inténtelo de nuevo más tarde.',
    USER_NOT_VERIFIED: 'El usuario asociado a esta identificación aún no ha completado el proceso de verificación.',
    REQUEST_PROCESSING_ERROR: 'Se ha producido un error al procesar la solicitud.',
    ERROR_DELETING_RECORD: 'Error al eliminar el registro',
    ERROR_500: "Error interno del servidor",
    USER_PROFILE_EXISTS: 'El usuario con esta identificacion ya tiene asignado este perfil',
    IDENTIFICATION_ALREADY_EXISTS: 'La identificación de este {entity} ya se encuentra registrada y activa.',
    EMAIL_ALREADY_EXISTS: 'El correo electronico de este {entity} ya se encuentra registrado',
    EMPLOYEE_ALREADY_ASSIGNED: 'El colaborador ya se encuentra asignado a este cliente'
}

export default RESPONSE_MESSAGES