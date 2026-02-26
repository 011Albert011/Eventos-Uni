document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("selector-evento");
  const tbody = document.getElementById("cuerpo-tabla-asistentes");
  const btnExportar = document.getElementById("btn-exportar");

  // 1. Cargar selector con eventosU
  function cargarSelector() {
    const eventos = JSON.parse(localStorage.getItem("eventosU")) || [];
    selector.innerHTML =
      '<option value="" selected disabled>--Elige un evento--</option>';
    eventos.forEach((evento) => {
      const opcion = document.createElement("option");
      opcion.value = evento.id;
      opcion.textContent = evento.titulo;
      selector.appendChild(opcion);
    });
  }

  // 2. Pintar tabla buscando en asistentesU
  function renderizarTabla() {
    const idEventoSeleccionado = Number(selector.value); // Convertir a número
    const asistentes = JSON.parse(localStorage.getItem("asistentesU")) || [];

    // Filtramos solo los asistentes que pertenezcan al evento seleccionado
    const inscritos = asistentes.filter(
      (a) => a.idEvento === idEventoSeleccionado,
    );

    tbody.innerHTML = "";

    if (inscritos.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5">No hay asistentes registrados.</td></tr>';
      return;
    }

    inscritos.forEach((asistente) => {
      const tr = document.createElement("tr");
      const claseBadge =
        asistente.estado === "Confirmado" ? "bg-success" : "bg-secondary";
      tr.innerHTML = `
                <td>${asistente.id}</td>
                <td>${asistente.nombre}</td>
                <td>${asistente.email}</td>
                <td><span class="badge rounded-pill ${claseBadge}">${asistente.estado}</span></td>
                <td>
                    <button type="button" class="btn-confirmar" data-id="${asistente.id}">✔️</button>
                    <button type="button" class="btn-eliminar" data-id="${asistente.id}" data-idevento="${asistente.idEvento}">🗑️</button>
                </td>
            `;
      tbody.appendChild(tr);
    });
  }

  // 3. Confirmar o Eliminar (Lógica actualizada a bases separadas)
  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const idAsistente = Number(btn.getAttribute("data-id"));
    let asistentes = JSON.parse(localStorage.getItem("asistentesU")) || [];
    const index = asistentes.findIndex((a) => a.id === idAsistente);

    if (btn.classList.contains("btn-confirmar")) {
      asistentes[index].estado = "Confirmado";
      localStorage.setItem("asistentesU", JSON.stringify(asistentes));
      renderizarTabla();
    } else if (btn.classList.contains("btn-eliminar")) {
      const idEvento = Number(btn.getAttribute("data-idevento"));
      asistentes.splice(index, 1); // Borramos de asistentesU
      localStorage.setItem("asistentesU", JSON.stringify(asistentes));

      // Le devolvemos un cupo al evento en eventosU
      let eventos = JSON.parse(localStorage.getItem("eventosU")) || [];
      const eventoIndex = eventos.findIndex((ev) => ev.id === idEvento);
      if (eventoIndex !== -1) {
        eventos[eventoIndex].cupo++;
        localStorage.setItem("eventosU", JSON.stringify(eventos));
      }
      renderizarTabla();
    }
  });

  // 4. Exportar a TXT
  btnExportar.addEventListener("click", () => {
    const idEventoSeleccionado = Number(selector.value);
    if (!idEventoSeleccionado) {
      alert("Por favor, selecciona un evento primero.");
      return;
    }

    const eventos = JSON.parse(localStorage.getItem("eventosU")) || [];
    const evento = eventos.find((e) => e.id === idEventoSeleccionado);
    const asistentes = JSON.parse(localStorage.getItem("asistentesU")) || [];
    const inscritos = asistentes.filter(
      (a) => a.idEvento === idEventoSeleccionado,
    );

    let contenidoTxt = `EventosU - Lista de Asistentes\n------------------------------------\n`;
    contenidoTxt += `Evento: ${evento.titulo}\nFecha: ${evento.fecha}\nSede: ${evento.sede}\n\n`;

    inscritos.forEach((a) => {
      contenidoTxt += `ID: ${a.id}\nNombre: ${a.nombre}\nEmail: ${a.email}\nEstado: ${a.estado}\n------------------------------------\n`;
    });
    contenidoTxt += `Total de asistentes registrados: ${inscritos.length}\n`;

    const archivo = new Blob([contenidoTxt], { type: "text/plain" });
    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = URL.createObjectURL(archivo);
    enlaceDescarga.download = `asistentes_${evento.titulo}.txt`;
    enlaceDescarga.click();
  });

  selector.addEventListener("change", renderizarTabla);
  cargarSelector();
});
