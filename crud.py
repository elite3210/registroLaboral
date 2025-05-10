from models import session, Empleado, Tarifa, RegistroLaboral
from datetime import datetime

# Crear un empleado
def crear_empleado(employed_id, names, surnames, birth, email, phone):
    empleado = Empleado(
        employed_id=employed_id,
        names=names,
        surnames=surnames,
        birth=birth,
        email=email,
        phone=phone
    )
    session.add(empleado)
    session.commit()
    return empleado

# Obtener todos los empleados
def obtener_empleados():
    return session.query(Empleado).all()

# Crear una tarifa
def crear_tarifa(job_id, description_job, price_hour):
    tarifa = Tarifa(
        job_id=job_id,
        description_job=description_job,
        price_hour=price_hour
    )
    session.add(tarifa)
    session.commit()
    return tarifa

# Crear un registro laboral
def crear_registro_laboral(employed_id, input_work, output_work):
    registro = RegistroLaboral(
        employed_id=employed_id,
        input_work=input_work,
        output_work=output_work
    )
    session.add(registro)
    session.commit()
    return registro

# Obtener registros laborales
def obtener_registros_laborales():
    return session.query(RegistroLaboral).all()