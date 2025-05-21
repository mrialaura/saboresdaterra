document.addEventListener('DOMContentLoaded', function () {
    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Range Slider
    const pessoasSlider = document.getElementById('pessoas-slider');
    const pessoasValue = document.getElementById('pessoas-value');
    const pessoasInput = document.getElementById('pessoas-input');

    if (pessoasSlider && pessoasValue) {
        // Valores mínimo e máximo
        const minPessoas = parseInt(pessoasSlider.getAttribute('min') || '1');
        const maxPessoas = parseInt(pessoasSlider.getAttribute('max') || '20');

        // Pegar valor atual do slider (respeita o valor definido no HTML)
        const valorAtual = parseInt(pessoasSlider.value);
        // Atualizar texto para corresponder ao valor atual
        pessoasValue.textContent = valorAtual + (valorAtual == 1 ? ' pessoa' : ' pessoas');

        // Atualizar valor quando o slider é movido
        pessoasSlider.addEventListener('input', function () {
            const value = parseInt(this.value);
            atualizaValorPessoas(value);
        });

        // Se existe um campo de input numérico para pessoas
        if (pessoasInput) {
            // Sincronizar input com slider
            pessoasInput.addEventListener('input', function () {
                let value = parseInt(this.value);

                // Garantir que está dentro dos limites
                if (isNaN(value)) value = minPessoas;
                if (value < minPessoas) value = minPessoas;
                if (value > maxPessoas) value = maxPessoas;

                // Atualizar o slider e o texto
                pessoasSlider.value = value;
                atualizaValorPessoas(value);
            });

            // Atualizar input quando slider muda
            pessoasSlider.addEventListener('input', function () {
                pessoasInput.value = this.value;
            });
        }

        // Adicionar botões de incremento/decremento
        const decrementBtn = document.createElement('button');
        decrementBtn.type = 'button';
        decrementBtn.className = 'pessoas-btn decrement';
        decrementBtn.textContent = '-';
        decrementBtn.setAttribute('aria-label', 'Diminuir número de pessoas');

        const incrementBtn = document.createElement('button');
        incrementBtn.type = 'button';
        incrementBtn.className = 'pessoas-btn increment';
        incrementBtn.textContent = '+';
        incrementBtn.setAttribute('aria-label', 'Aumentar número de pessoas');

        // Inserir botões antes e depois do slider
        pessoasSlider.parentNode.insertBefore(decrementBtn, pessoasSlider);
        pessoasSlider.parentNode.insertBefore(incrementBtn, pessoasSlider.nextSibling);

        // Adicionar eventos aos botões
        decrementBtn.addEventListener('click', function () {
            const currentValue = parseInt(pessoasSlider.value);
            if (currentValue > minPessoas) {
                const newValue = currentValue - 1;
                pessoasSlider.value = newValue;
                atualizaValorPessoas(newValue);
                if (pessoasInput) pessoasInput.value = newValue;
            }
        });

        incrementBtn.addEventListener('click', function () {
            const currentValue = parseInt(pessoasSlider.value);
            if (currentValue < maxPessoas) {
                const newValue = currentValue + 1;
                pessoasSlider.value = newValue;
                atualizaValorPessoas(newValue);
                if (pessoasInput) pessoasInput.value = newValue;
            }
        });
    }

    // Função para atualizar texto de pessoas
    function atualizaValorPessoas(value) {
        if (pessoasValue) {
            pessoasValue.textContent = value + (value == 1 ? ' pessoa' : ' pessoas');
        }
    }

    // Form Submission
    const reservationForm = document.getElementById('reservation-form');
    const confirmationMessage = document.getElementById('confirmation-message');

    if (reservationForm && confirmationMessage) {
        reservationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validação completa
            let isValid = true;
            let formData = {};

            // Validar nome
            const nome = document.getElementById('nome');
            if (nome && nome.value.trim() === '') {
                isValid = false;
                highlightInvalid(nome);
            } else if (nome) {
                removeHighlight(nome);
                formData.nome = nome.value;
            }

            // Validar email
            const email = document.getElementById('email');
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email.value)) {
                    isValid = false;
                    highlightInvalid(email);
                } else {
                    removeHighlight(email);
                    formData.email = email.value;
                }
            }

            // Validar telefone
            const telefone = document.getElementById('telefone');
            if (telefone) {
                const telRegex = /^[0-9()+\- ]{10,15}$/;
                if (!telRegex.test(telefone.value)) {
                    isValid = false;
                    highlightInvalid(telefone);
                } else {
                    removeHighlight(telefone);
                    formData.telefone = telefone.value;
                }
            }

            // Validar data
            const data = document.getElementById('data');
            if (data && !data.value) {
                isValid = false;
                highlightInvalid(data);
            } else if (data) {
                removeHighlight(data);
                formData.data = data.value;
            }

            // Validar horário
            const horario = document.getElementById('horario');
            if (horario && !horario.value) {
                isValid = false;
                highlightInvalid(horario);
            } else if (horario) {
                removeHighlight(horario);
                formData.horario = horario.value;
            }

            // Pegar número de pessoas
            if (pessoasSlider) {
                formData.pessoas = pessoasSlider.value;
            }

            // Coletar outras informações relevantes
            const mesa = document.querySelector('input[name="mesa"]:checked');
            if (mesa) {
                formData.mesa = mesa.value;
            }

            const observacoes = document.getElementById('observacoes');
            if (observacoes) {
                formData.observacoes = observacoes.value;
            }

            if (isValid) {
                // Em uma aplicação real, você enviaria esses dados para o servidor
                console.log('Formulário enviado com sucesso!', formData);

                // Mostrar mensagem de confirmação com detalhes
                confirmationMessage.innerHTML = `
                    <h3>Reserva Confirmada!</h3>
                    <p><strong>Nome:</strong> ${formData.nome}</p>
                    <p><strong>Data:</strong> ${formatDate(formData.data)}</p>
                    <p><strong>Horário:</strong> ${formData.horario}</p>
                    <p><strong>Pessoas:</strong> ${formData.pessoas}</p>
                    ${formData.mesa ? `<p><strong>Mesa:</strong> ${formData.mesa}</p>` : ''}
                    <p>Enviamos um email de confirmação para ${formData.email}</p>
                    <p>Obrigado pela preferência!</p>
                `;

                confirmationMessage.style.display = 'block';

                // Rolar até a mensagem
                confirmationMessage.scrollIntoView({ behavior: 'smooth' });

                // Resetar formulário após envio
                setTimeout(() => {
                    reservationForm.reset();

                    // Reiniciar o slider para valor padrão se existir
                    if (pessoasSlider && pessoasValue) {
                        pessoasSlider.value = pessoasSlider.getAttribute('min') || '1';
                        atualizaValorPessoas(parseInt(pessoasSlider.value));
                        if (pessoasInput) pessoasInput.value = pessoasSlider.value;
                    }

                    // Limpar mensagem de confirmação após 10 segundos
                    setTimeout(() => {
                        confirmationMessage.style.display = 'none';
                    }, 10000);

                }, 2000);
            }
        });
    }

    // Funções helper para formulário
    function highlightInvalid(element) {
        element.classList.add('invalid');
        // Adicionar mensagem de erro se necessário
        const errorMsg = element.parentNode.querySelector('.error-message');
        if (!errorMsg) {
            const msg = document.createElement('div');
            msg.className = 'error-message';
            msg.style.color = '#e63946';
            msg.style.fontSize = '0.8rem';
            msg.style.marginTop = '5px';
            msg.textContent = 'Este campo é obrigatório';
            element.parentNode.appendChild(msg);
        }
    }

    function removeHighlight(element) {
        element.classList.remove('invalid');
        const errorMsg = element.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    function formatDate(dateString) {
        try {
            const parts = dateString.split('-');
            if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            return dateString;
        } catch (e) {
            return dateString;
        }
    }

    // Smooth scrolling para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignorar links vazios

            const target = document.querySelector(targetId);
            if (!target) return; // Se o alvo não existe, não fazer nada

            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Fechar o menu móvel se estiver aberto
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
            }
        });
    });

    // Menu ativo baseado na posição de rolagem
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('#main-nav a');

    if (sections.length > 0 && navLinks.length > 0) {
        // Inicializar link ativo para a primeira seção visível
        updateActiveLink();

        // Atualizar durante a rolagem
        window.addEventListener('scroll', updateActiveLink);
    }

    function updateActiveLink() {
        let currentSection = '';
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

        // Definir uma margem para considerar uma seção como ativa
        const offset = window.innerHeight * 0.3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (scrollPos >= sectionTop - offset &&
                scrollPos < sectionTop + sectionHeight - offset) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            // Verificar se é a página inicial
            if (currentSection === '' && href === '#') {
                link.classList.add('active');
            }
            // Para outras seções
            else if (href === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Inicializar campos de data com data mínima (hoje)
    const dataInput = document.getElementById('data');
    if (dataInput) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
        const yyyy = today.getFullYear();

        const formattedToday = `${yyyy}-${mm}-${dd}`;
        dataInput.setAttribute('min', formattedToday);
    }
});



document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('pessoasSlider');
    const displayPessoas = document.getElementById('displayPessoas');
    const mensagemReserva = document.getElementById('mensagemReserva');
    
    // Função para atualizar o texto com base no valor do slider
    function atualizarTexto() {
        const numeroPessoas = parseInt(slider.value);
        
        // Atualiza o texto de exibição
        if (numeroPessoas === 1) {
            displayPessoas.textContent = `${numeroPessoas} pessoa`;
        } else {
            displayPessoas.textContent = `${numeroPessoas} pessoas`;
        }
        
        // Atualiza a mensagem de reserva
        let mensagem = `Sua reserva será para ${numeroPessoas} ${numeroPessoas === 1 ? 'pessoa' : 'pessoas'}.`;
        
        // Adiciona mensagem adicional para grupos grandes
        if (numeroPessoas >= 6) {
            mensagem += ' Recomendamos fazer a reserva com antecedência para grupos grandes.';
        }
        
        mensagemReserva.textContent = mensagem;
    }
    
    // Evento para quando o slider é movido
    slider.addEventListener('input', atualizarTexto);
    
    // Inicializar com o valor padrão
    atualizarTexto();
});