from flask import Flask, request, jsonify
from crud import crear_empleado, obtener_empleados, crear_tarifa, crear_registro_laboral, obtener_registros_laborales

app = Flask(__name__)

@app.route('/api/empleados', methods=['POST'])
def agregar_empleado():
    data = request.json
    empleado = crear_empleado(
        employed_id=data['employed_id'],
        names=data['names'],
        surnames=data['surnames'],
        birth=data.get('birth'),
        email=data.get('email'),
        phone=data.get('phone')
    )
    return jsonify({'message': 'Empleado creado', 'empleado': empleado.employed_id})

@app.route('/api/empleados', methods=['GET'])
def listar_empleados():
    empleados = obtener_empleados()
    return jsonify([{
        'employed_id': e.employed_id,
        'names': e.names,
        'surnames': e.surnames,
        'birth': e.birth,
        'email': e.email,
        'phone': e.phone
    } for e in empleados])

@app.route('/api/tarifas', methods=['POST'])
def agregar_tarifa():
    data = request.json
    tarifa = crear_tarifa(
        job_id=data['job_id'],
        description_job=data['description_job'],
        price_hour=data['price_hour']
    )
    return jsonify({'message': 'Tarifa creada', 'tarifa': tarifa.job_id})

@app.route('/api/tarifas', methods=['GET'])
def listar_tarifas():
    tarifas = obtener_tarifas()
    return jsonify([{
        'job_id': t.job_id,
        'description_job': t.description_job,
        'price_hour': t.price_hour
    } for t in tarifas])

if __name__ == '__main__':
    app.run(debug=True)