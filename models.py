from sqlalchemy import create_engine, Column, Integer, String, Date, DECIMAL, Boolean, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

Base = declarative_base()

# Modelo para empleados
class Empleado(Base):
    __tablename__ = 'empleados'

    id = Column(Integer, primary_key=True)
    employed_id = Column(String(10), unique=True, nullable=False)
    names = Column(String(100), nullable=False)
    surnames = Column(String(100), nullable=False)
    birth = Column(Date)
    email = Column(String(100))
    phone = Column(String(15))

# Modelo para tarifas
class Tarifa(Base):
    __tablename__ = 'tarifas'

    id = Column(Integer, primary_key=True)
    job_id = Column(String(10), unique=True, nullable=False)
    description_job = Column(String(100), nullable=False)
    price_hour = Column(DECIMAL(10, 2), nullable=False)

# Modelo para registro laboral
class RegistroLaboral(Base):
    __tablename__ = 'registro_laboral'

    id = Column(Integer, primary_key=True)
    employed_id = Column(String(10), ForeignKey('empleados.employed_id'), nullable=False)
    input_work = Column(DateTime, nullable=False)
    output_work = Column(DateTime, nullable=False)
    status = Column(Boolean, default=False)

# Configuración de la base de datos
DATABASE_URL = "mysql+pymysql://root:password@localhost/registro_laboral"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Crear las tablas
Base.metadata.create_all(engine)