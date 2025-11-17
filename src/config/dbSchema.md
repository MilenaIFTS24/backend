## Esquema de la Base de Datos

### 1. Colección: users (Usuarios)


| Campo | Tipo | Requisito / Propósito |
| :--- | :--- | :--- |
| **id** | `String` (Auto) | Identificador único del documento. |
| **fullName** | `String` | Nombre completo del usuario (**Obligatorio**). |
| **email** | `String` | Correo electrónico **único** (**Obligatorio**). |
| **password** | `String` | Contraseña hasheada (**mín. 6 caracteres**). |
| **dateOfBirth** | `String` | Fecha de nacimiento (Formato **DD-MM-YY**). |
| **role** | `String` | Rol del usuario (`user` o `admin`). |
| **accountEnabled** | `Boolean` | Estado de la cuenta (**Opcional**, usado para bloquear accesos). |
| **phone** | `String` | Número de teléfono (**Opcional**). |
| **address** | `String` | Dirección de residencia (**Opcional**). |

---

### 2. Colección: teasProducts (Productos de Té)

| Campo | Tipo | Requisito / Propósito |
| :--- | :--- | :--- |
| **id** | `String` (Auto) | Identificador único del producto. |
| **name** | `String` | Nombre del producto (**Obligatorio**). |
| **price** | `Number` | Precio por unidad (Debe ser numérico y **$> 0$**). |
| **stock** | `Number` | Cantidad disponible en inventario (**$\ge 0$**). |
| **brand** | `String` | Marca o productor (**Opcional**). |
| **description** | `String` | Descripción del producto (**Opcional**). |

---

### 3. Colección: craftProducts (Productos de Artesanía)

| Campo | Tipo | Requisito / Propósito |
| :--- | :--- | :--- |
| **id** | `String` (Auto) | Identificador único del producto. |
| **name** | `String` | Nombre de la artesanía (**Obligatorio**). |
| **brandArtist** | `String` | Nombre del artista o taller (**Obligatorio**). |
| **description** | `String` | Descripción detallada (**Obligatorio**). |
| **creationDate** | `String` | Fecha de creación (Formato **DD-MM-YY**). |
| **price** | `Number` | Precio de venta (**$> 0$**). |
| **stock** | `Number` | Cantidad en inventario (**$\ge 0$**). |
| **ecoFriendly** | `Boolean` | Indicador de si es ecológico (**Opcional**). |

---

### 4. Colección: events (Eventos)

| Campo | Tipo | Requisito / Propósito |
| :--- | :--- | :--- |
| **id** | `String` (Auto) | Identificador único del evento. |
| **title** | `String` | Título del evento (**Mín. 5 caracteres**). |
| **date** | `String` | Fecha (Formato **DD-MM-YY**). |
| **startTime** | `String` | Hora de inicio (HH:MM). |
| **endTime** | `String` | Hora de finalización (Debe ser **posterior a startTime**). |
| **location** | `String` | Ubicación (**Mín. 5 caracteres**). |
| **description** | `String` | Descripción (**Mín. 10 caracteres**). |
| **entryPrice** | `Number` | Costo de la entrada (**$\ge 0$**). |
| **isFree** | `Boolean` | Indica si es gratuito (Si es `true`, `entryPrice` debe ser $0$). |
| **registrationRequired** | `Boolean` | Indica si se requiere inscripción. |
| **isVirtual** | `Boolean` | Indica si es online. |
| **cancelledByRain** | `Boolean` | Indicador de cancelación por lluvia (**Opcional**). |

---

### 5. Colección: offers (Ofertas y Descuentos)

| Campo | Tipo | Requisito / Propósito |
| :--- | :--- | :--- |
| **id** | `String` (Auto) | Identificador único de la oferta. |
| **title** | `String` | Título de la promoción (**Mín. 5 caracteres**). |
| **promotionalCode** | `String` | Código **único** (**Mín. 3 caracteres**). |
| **applicableTo** | `Array` | Array de `{type: 'tea' | 'craft', value: <num>, condition: '...'}` |
| **minimumPurchase** | `Number` | Monto mínimo requerido para aplicar (**$\ge 0$**). |
| **startDate** | `String` | Fecha de inicio de validez (DD-MM-YY). |
| **endDate** | `String` | Fecha de fin de validez (DD-MM-YY). |
| **state** | `String` | Estado (`active`, `inactive`, `expired`). |
| **isLimited** | `Boolean` | Indica si tiene un límite de usos. |
| **limit** | `Number` | Cantidad máxima de usos (**Obligatorio** si `isLimited` es `true`). |

---

### 6. Colección: reservations (Reservas/Pedidos)

| Campo | Tipo | Requisito / Propósito |
| :--- | :--- | :--- |
| **id** | `String` (Auto) | Identificador único de la reserva. |
| **userId** | `String`/`Number` | ID del usuario que realizó la reserva. |
| **products** | `Array` | Lista de productos: `{type, id, quantity (>0), unitPrice (>=0)}`. |
| **totalAmount** | `Number` | Monto final a pagar (**$\ge 0$**). |
| **pickupDate** | `String` | Fecha de retiro/entrega (DD-MM-YY). |
| **pickupTimeSlot** | `String` | Franja horaria (HH:MM-HH:MM). |
| **contactEmail** | `String` | Email de contacto. |
| **paymentMethod** | `String` | Método de pago (`debit`, `credit`, `cash`, `wallet`). |
| **state** | `String` | Estado (`paid`, `pending_pickup`, `finished`, `cancelled`). |
| **subtotal** | `Number` | Monto antes de descuentos (**$\ge 0$**). |
| **cancellationDate** | `String` | Fecha de cancelación (DD-MM-YY) (**Opcional**). |
| **discount** | `Number` | Monto del descuento aplicado (**Opcional**). |
| **discountCode** | `String` | Código promocional usado (**Opcional**). |
| **ecoPackaging** | `Boolean` | Empaque ecológico solicitado (**Opcional**). |
| **customerNotes** | `String` | Notas del cliente (**Opcional**).