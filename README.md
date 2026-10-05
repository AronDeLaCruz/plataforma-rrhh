# Sistema RRHH — Ingresantes

Sistema integral de gestión de postulantes y procesos de contratación, desarrollado como proyecto de portafolio full stack. Permite a candidatos postular a vacantes, completar su ficha de datos y subir su documentación, mientras el equipo de RRHH gestiona el proceso completo desde un panel administrativo.

## 📋 Tabla de contenidos

- [Qué resuelve](#que-resuelve)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Características principales](#características-principales)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Cómo levantar el proyecto](#cómo-levantar-el-proyecto)
- [Variables de entorno](#variables-de-entorno)
- [Modelo de datos](#modelo-de-datos)
- [Flujos principales](#flujos-principales)
- [Roadmap](#roadmap)

## Qué resuelve
Un proceso de contratación típicamente involucra tres actores con necesidades distintas: el candidato que postula y sube documentación, el equipo de RRHH que revisa y aprueba esa documentación, y un historial que agrupa todas las postulaciones de una misma persona a lo largo del tiempo. Este proyecto separa esas tres necesidades en piezas independientes (dos frontends + un backend compartido) en vez de forzarlas dentro de una sola aplicación monolítica.

## Arquitectura

El sistema está compuesto por tres aplicaciones independientes que se comunican a través de una API REST:

```
┌─────────────────────┐      ┌──────────────────────┐      ┌─────────────────────┐
│  Frontend Postulante │      │   Backend (API REST)  │      │  Frontend RRHH/Admin│
│  (candidato externo) │◄────►│   ASP.NET Core .NET 10 │◄────►│  (uso interno)      │
└─────────────────────┘      └──────────┬───────────┘      └─────────────────────┘
                                         │
                                         ▼
                                 ┌───────────────┐
                                 │  SQL Server    │
                                 └───────────────┘
```

Se decidió separar el frontend del candidato del frontend de RRHH en dos aplicaciones distintas (en vez de una sola con rutas protegidas) por motivos de seguridad y de experiencia de usuario: cada una se despliega, versiona y escala de forma independiente, y el código de gestión interna nunca viaja al navegador de un candidato externo.

## Tecnologías

**Backend**
- ASP.NET Core 10 (Web API)
- Entity Framework Core (SQL Server)
- Autenticación JWT con dos esquemas de acceso diferenciados (RRHH por usuario/contraseña, Postulante por DNI + código de acceso)
- FluentValidation
- Swagger / OpenAPI
- Rate limiting nativo de .NET
- Almacenamiento de archivos local (abstraído detrás de una interfaz, reemplazable por Azure Blob / S3)

**Frontend — Panel de postulantes**
- Next.js (App Router)
- Tailwind CSS
- Zustand (manejo de estado: `authStore`, `postulanteStore`, `documentoStore`)

**Frontend — Panel de RRHH**
- React
- Consume la misma API con un token de alcance distinto (rol RRHH/Admin)

## Características principales

- **Postulación en un solo paso**: el candidato carga sus datos personales y aplica a una vacante sin necesidad de crear una cuenta previa.
- **Reingreso sin contraseña**: el postulante accede luego con su número de documento + un código numérico de 5 dígitos, sin gestión de contraseñas de su lado.
- **Ficha de personal**: formulario completo de datos (personales, educación, experiencia laboral) asociado a cada postulación.
- **Gestión documental**: 16 tipos de documentos configurables (requeridos u opcionales, con extensión y tamaño máximo definibles), cada uno con flujo de aprobación/rechazo por parte de RRHH.
- **Legajo histórico**: RRHH puede ver todas las postulaciones de una misma persona a través del tiempo, agrupadas por documento de identidad.
- **Autenticación dual**: dos tipos de token JWT conviven en el mismo backend — uno para usuarios internos de RRHH (con roles) y otro de alcance acotado para el postulante autenticado, cada uno con sus propias políticas de autorización.
- **Gestión de usuarios y roles**: el primer usuario registrado queda como Admin; de ahí en adelante, el alta de nuevos usuarios de RRHH se gestiona desde el propio panel, no por registro público.
- **Datos semilla automáticos**: al levantar el backend contra una base vacía, se siembran automáticamente los 16 tipos de documento, un usuario Admin inicial y vacantes de ejemplo.

## Estructura del repositorio

```
plataforma-rrhh/                 ← raíz del repo
├── Ingresantes/                 ← Backend (ASP.NET Core .NET 10)
│   ├── Controllers/
│   ├── Services/
│   ├── Models/
│   │   └── Entities/
│   ├── Dto/
│   │   ├── Auth/
│   │   ├── Common/
│   │   ├── Ficha/
│   │   ├── Postulaciones/
│   │   ├── Postulante/
│   │   ├── Puesto/
│   │   ├── TipoDocumento/
│   │   └── User/
│   ├── Data/
│   │   └── Configurations/
│   ├── Exceptions/
│   ├── Middleware/
│   ├── Migrations/
│   └── UploadedFiles/
├── sistema-postulantes/         ← Frontend candidato (Next.js)
│   └── app/
│       ├── components/
│       ├── dashboard/
│       ├── pages/
│       ├── services/
│       ├── store/
│       ├── types/
│       └── utils/
└── sistema-rrhh/                ← Frontend RRHH (React + Vite)
    └── src/
        ├── assets/
        ├── components/
        ├── constants/
        ├── pages/
        ├── services/
        ├── store/
        ├── styles/


## Cómo levantar el proyecto

### 1. Backend

```bash
cd Ingresantes

# Configurar la clave JWT (nunca se sube al repo)
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "una-clave-de-al-menos-32-caracteres"

# Configurar la cadena de conexión a SQL Server en appsettings.json
# "ConnectionStrings:RrhhDb"

dotnet restore
dotnet ef database update
dotnet run
```

Al arrancar contra una base vacía, el sistema siembra automáticamente los tipos de documento, el usuario Admin y vacantes de ejemplo. Revisá la consola o el `DataSeeder` para las credenciales iniciales del Admin.

La API queda disponible en `http://localhost:5253` (o el puerto configurado), con Swagger en `/swagger`.

### 2. Frontend — Panel de postulantes

```bash
cd frontend-postulantes
npm install
npm run dev
```

### 3. Frontend — Panel de RRHH

```bash
cd frontend-admin
npm install
npm run dev
```

Confirmá que la URL de cada frontend esté incluida en la política de CORS del backend (`Program.cs` → `Frontend:Urls`).

## Variables de entorno

**Backend (`appsettings.json` / user-secrets)**

| Variable | Descripción |
|---|---|
| `ConnectionStrings:RrhhDb` | Cadena de conexión a SQL Server |
| `Jwt:Key` | Clave de firma de los tokens (mínimo 32 caracteres) |
| `Jwt:Issuer` / `Jwt:Audience` | Emisor y audiencia del token |
| `Jwt:ExpirationMinutes` | Duración del token de sesión de RRHH |
| `FileStorage:LocalPath` | Carpeta donde se guardan los documentos subidos |

**Frontends**

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` / `VITE_API_URL` | URL base de la API |

## Modelo de datos

Entidades principales y sus relaciones:

- **Postulante**: identidad de la persona (datos personales, DNI). Se reutiliza si la misma persona postula más de una vez.
- **Puesto**: vacante publicada por RRHH.
- **Postulacion**: una aplicación concreta de un Postulante a un Puesto. Es el punto de anclaje de la ficha, documentos, educación y experiencia de esa postulación específica.
- **Ficha**: datos extendidos del formulario de personal, asociada a una Postulacion.
- **Educacion / Experiencia**: historial académico y laboral cargado por el candidato.
- **Documentos**: archivos subidos, cada uno con su tipo, estado de revisión (Pendiente/Aprobado/Rechazado) y comentario de RRHH.
- **TipoDocumentoConfig**: catálogo configurable de los tipos de documento requeridos.
- **User**: usuarios internos de RRHH/Admin.

## Flujos principales

**Postulación de un candidato**
1. El candidato completa el formulario público y postula a una vacante (`POST /api/Postulacion`).
2. El sistema le devuelve un código numérico de acceso, que debe guardar.
3. Con su DNI + código, puede reingresar (`POST /api/Postulacion/ingreso`) para completar su ficha y subir documentos, en cualquier momento posterior.

**Revisión por RRHH**
1. RRHH se autentica con usuario/contraseña.
2. Busca al postulante por DNI/nombre o revisa el legajo completo de su historial de postulaciones.
3. Revisa cada documento subido y lo aprueba o rechaza, con comentario opcional.

## Roadmap

- [ ] Notificaciones por email al cambiar el estado de una postulación
- [ ] Exportación de legajos a PDF
- [ ] Panel de configuración de flujo de estados de postulación
- [ ] Tests automatizados (unitarios sobre los servicios, de integración sobre los endpoints)

---

Autor:
Aron Alonso De La Cruz Gutiérrez 
