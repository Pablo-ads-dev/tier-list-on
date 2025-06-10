import Swal from 'sweetalert2';

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnAddTier");
    btn?.addEventListener("click", addTier);

    const dropzones = document.querySelectorAll<HTMLElement>(".dropzone");
    const draggables = document.querySelectorAll<HTMLElement>(".draggable");

    function handleDragStart(e: DragEvent) {
        const target = e.target as HTMLElement;

        if (target && target.classList.contains('draggable')) {
            const id = target.dataset.id;
            console.log("id", id);

            if (e.dataTransfer) {
                e.dataTransfer.setData('text/plain', id || '');
            }
        }
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        const dropzone = e.currentTarget as HTMLElement;
        dropzone.classList.add('over');
    }

    function handleDragLeave(e: DragEvent) {
        const dropzone = e.currentTarget as HTMLElement;
        dropzone.classList.remove('over');
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        const dropzone = e.currentTarget as HTMLElement;
        dropzone.classList.remove('over');
        const dataTransfer = e.dataTransfer;
        if (!dataTransfer) return;
        const id = dataTransfer.getData('text/plain');
        const elemento = document.getElementById(id);
        if (elemento) {
            dropzone.append(elemento);
        }
        verificaImageContainer();
    }

    document.addEventListener('dragstart', handleDragStart);

    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', handleDragOver);
        dropzone.addEventListener('dragleave', handleDragLeave);
        dropzone.addEventListener('drop', handleDrop);
    });

    function verificaImageContainer() {
        const espacoImagem = document.getElementById("espacoImagem");
        const quantidadeImagens = espacoImagem ? espacoImagem.children.length : 0;
        const espaco = document.getElementById("espacoImagem") as HTMLElement;
        if (quantidadeImagens <= 0) {
            espaco?.classList.add("d-none");
        } else {
            return;
        }
    }

    function inicializarDropzone() {
        const novasDropzones = document.querySelectorAll<HTMLElement>(".dropzone");
        novasDropzones.forEach(dropzone => {
            dropzone.addEventListener('dragover', handleDragOver);
            dropzone.addEventListener('dragleave', handleDragLeave);
            dropzone.addEventListener('drop', handleDrop);
        });
    }
    function generateHexId(length = 16): string {
        // length = número de bytes; a string terá 2×length caracteres em hex
        const bytes = crypto.getRandomValues(new Uint8Array(length));
        return Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    function addTier() {
        const inputElement = document.getElementById("inputNome") as HTMLInputElement | null;

        if (!inputElement) {
            console.error("Elemento de input não encontrado!");
            return;
        }

        const nomeInput = inputElement.value;

        const html = `
                <div class="col-md-12 d-flex bordered tierDrop" data-ordem="">
                    <div class="blockTier text-center">
                        <!-- Cor selecionada na criação da tierlist -->
                        <span class="text-light ">${nomeInput}</span>
                    </div>
                </div> `;

        const containerAppend = document.getElementById("tierList");

        if (containerAppend) {
            containerAppend.insertAdjacentHTML('beforeend', html);
        } else {
            console.error("Elemento .containerList não encontrado.");
        }
    }

    function toggleSidenav(size?: number): void {
        const sidenav = document.getElementById("sidenav");
        const overlay = document.getElementById("overlay");

        if (!sidenav || !overlay) return;

        const isOpen = sidenav.classList.contains("open");
        sidenav.style.width = `${size}px`;

        if (isOpen) {
            sidenav.classList.remove("open");
            overlay.classList.remove("active");
        } else {
            sidenav.classList.add("open");
            overlay.classList.add("active");
        }
    }

    // Expor globalmente (TypeScript)
    (window as any).toggleSidenav = toggleSidenav;

    function criarTier(): void {

        const nomeTierElement = document.getElementById("tierName") as HTMLInputElement;
        const corTierElement = document.getElementById("tierColor") as HTMLInputElement;
        const nomeTier = nomeTierElement.value;
        const corTier = corTierElement.value;

        if (!nomeTier || !corTier) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção!',
                text: 'Preencha todos os campos',
                confirmButtonText: 'OK',
                confirmButtonColor: '#d33'
            })
            return;
        }
        const containerAppend = document.getElementById("tierList");

        const ordemAtual = document.querySelectorAll(".dropzone").length + 1;

        const component = `
                <div class="col-12 d-flex align-items-center bordered tierRow">
                    <div class="blockTier text-center editableDiv" contenteditable="true" maxlength="30"
                        style="background-color:${corTier}">
                        ${nomeTier}
                    </div>
                    <div class="tier-sort dropzone" data-ordem="${ordemAtual}"></div>
                    <div class="settings">
                        <button class="btn"> <i class="fa-solid fa-gear fa-xl text-light"></i></button>
                    </div>
                </div>
                `
        if (containerAppend) {
            containerAppend.insertAdjacentHTML('beforeend', component);
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Tier criado com sucesso!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#65B800'
            })
            toggleSidenav();
            inicializarDropzone()
        }

    }
    (window as any).criarTier = criarTier;


    function confirmarImagem() {
        const imagemElement = document.getElementById('imagemInput') as HTMLInputElement;

        if (imagemElement.files && imagemElement.files.length > 0) {
            const arquivo = imagemElement.files[0];
            const reader = new FileReader();
            const hashId = generateHexId(16);
            reader.onload = function (e) {
                const espacoImagem = document.querySelector(".espaco-imagens") as HTMLElement;
                const imagemBase64 = e.target?.result as string;
                const previewElement = `
                                     <div id="${hashId}" class="draggable preview" data-id="${hashId}" draggable="true" style="background-image: url(${imagemBase64})"></div>
                                    `;
                espacoImagem.insertAdjacentHTML('beforeend', previewElement);
                espacoImagem.classList.remove("d-none");
            };

            reader.readAsDataURL(arquivo);
        } else {
            console.log("Nenhuma imagem selecionada.");
        }
    }
    (window as any).confirmarImagem = confirmarImagem;

    function limpar() {
        const elementos = document.querySelectorAll(".draggable");
        // Para cada elemento encontrado, remove do DOM
        elementos.forEach(el => el.remove());
    }
    (window as any).limpar = limpar;

});
