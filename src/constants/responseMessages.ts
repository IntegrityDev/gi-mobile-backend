const RESPONSE_MESSAGES = {
    USER_EXISTS: 'Ya existe un usuario con esa identificación.',
    USER_NO_HAVE_EMPLOYEE: 'No hay un empleado relacionado a este numero de identificación',
    WRONG_LOGIN: 'La identificación o contraseña son incorrectas.',
    PASSWORD_CHANGED: 'La contraseña se ha cambiado correctamente, ahora puedes iniciar sesión indicando la nueva contraseña.',
    PASSWORD_NOT_CHANGE: 'No se pudo cambiar la contraseña. Por favor, inténtelo de nuevo más tarde.',
    USER_NOT_VERIFIED: 'El usuario asociado a esta identificación aún no ha completado el proceso de verificación.',
    REQUEST_PROCESSING_ERROR: 'Se ha producido un error al procesar la solicitud.',
    ERROR_DELETING_RECORD: 'Error al eliminar el registro',
    ERROR_500: "Error interno del servidor",
    USER_PROFILE_EXISTS: 'El usuario con esta identificacion ya tiene asignado este perfil',
    IDENTIFICATION_ALREADY_EXISTS: 'La identificación de este {entity} ya se encuentra registrada y activa.',
    EMAIL_ALREADY_EXISTS: 'El correo electronico de este {entity} ya se encuentra registrado',
    EMPLOYEE_ALREADY_ASSIGNED: 'El colaborador con identificación {identification}, ya se encuentra asignado a este cliente',
    EMPLOYEES_ASSIGNED: 'Empleados asignados exitosamente',
    EMPLOYEES_NOT_ASSIGNED: 'Los empleados no fueron asignados, por favor revise los mensajes de la aplicación',
    EMPLOYEES_ASSIGNED_WITH_ERRORS: 'Empleados asignados exitosamente, algunos no fueron asignado por favor revisalos',
    EMAIL_RESET_SENT: 'Se ha enviado un correo electrónico con el código de recuperación de la contraseña. Este código es válido durante 1 día.',
    EMAIL_RESET_FAILED: 'No se pudo enviar el correo electrónico de recuperación de contraseña, por favor verificalo e inténtelo nuevamente.',
    CODE_VERIFIED: 'La verificación del código fue realizada con éxito',
    CODE_VERIFIED_FAILED: 'El código no pudo ser verificado, por favor intente nuevamente',
    CODE_VERIFIED_EXPIRED: 'El código que intentas usar ha expirado, por favor genera uno nuevo',
    SOME_PARAMETERS_MISSING: 'Es posible que falten parametros a esta solicitud'
}

export default RESPONSE_MESSAGES