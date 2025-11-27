// Estado global de la aplicación
const AppState = {
    userData: null,
    consentData: {
        consent: {},
        decisions: {},
        biobank: {},
        signature: null,
        timestamp: null,
        deviceInfo: {}
    },
    currentPage: 'login',
    informationPageIndex: 0
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupLoginPage();
    setupInformationPage();
    setupConsentPage();
    setupSignaturePad();
    collectDeviceInfo();
}

// ============================================================================
// LOGIN PAGE
// ============================================================================

function setupLoginPage() {
    const dniInput = document.getElementById('dni-input');
    const dniSubmit = document.getElementById('dni-submit');
    const dniError = document.getElementById('dni-error');

    // Enter key support
    dniInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            dniSubmit.click();
        }
    });

    dniSubmit.addEventListener('click', async () => {
        const dni = dniInput.value.trim();

        if (!dni) {
            showError(dniError, 'Por favor, introduzca su DNI');
            return;
        }

        dniSubmit.disabled = true;
        dniSubmit.textContent = 'Validando...';

        try {
            const response = await fetch('/api/dni/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dni })
            });

            const result = await response.json();

            if (result.success) {
                AppState.userData = result.data;
                showConfirmationModal(result.data);
            } else {
                showError(dniError, result.message);
            }
        } catch (error) {
            showError(dniError, 'Error de conexión. Por favor, inténtelo de nuevo.');
            console.error('Error:', error);
        } finally {
            dniSubmit.disabled = false;
            dniSubmit.textContent = 'Continuar';
        }
    });
}

function showConfirmationModal(userData) {
    const modal = document.getElementById('confirmation-modal');
    const confirmText = document.getElementById('confirmation-text');
    const confirmBtn = document.getElementById('confirm-identity');
    const cancelBtn = document.getElementById('cancel-identity');

    confirmText.textContent = `Si usted es ${userData.name} ${userData.lastName}, presione "Continuar". En caso contrario, presione "Cancelar".`;

    modal.classList.add('show');

    confirmBtn.onclick = () => {
        modal.classList.remove('show');
        navigateToPage('information-page');
    };

    cancelBtn.onclick = () => {
        modal.classList.remove('show');
        document.getElementById('dni-input').value = '';
        document.getElementById('dni-input').focus();
    };
}

// ============================================================================
// INFORMATION PAGE
// ============================================================================

function setupInformationPage() {
    const btnPrev = document.getElementById('btn-prev-info');
    const btnNext = document.getElementById('btn-next-info');
    const btnIndex = document.getElementById('btn-index');
    const btnDownload = document.getElementById('btn-download-info');
    const contentContainer = document.getElementById('information-content');

    // Mostrar la primera página al cargar
    renderInformationSection(0);

    btnPrev.addEventListener('click', () => {
        if (AppState.informationPageIndex > 0) {
            AppState.informationPageIndex--;
            renderInformationSection(AppState.informationPageIndex);
        }
    });

    btnNext.addEventListener('click', () => {
        if (AppState.informationPageIndex < INFORMATION_SECTIONS.length - 1) {
            AppState.informationPageIndex++;
            renderInformationSection(AppState.informationPageIndex);
        } else {
            // Llegamos al final, ir a la página de consentimiento
            navigateToPage('consent-page');
        }
    });

    btnIndex.addEventListener('click', () => {
        showIndexModal();
    });

    btnDownload.addEventListener('click', () => {
        downloadInformationSheet();
    });
}

function renderInformationSection(index) {
    const contentContainer = document.getElementById('information-content');
    const btnPrev = document.getElementById('btn-prev-info');
    const btnNext = document.getElementById('btn-next-info');

    // Obtener la sección actual
    const sectionKey = INFORMATION_SECTIONS[index];
    const section = INFORMATION_CONTENT[sectionKey];

    // Renderizar el contenido
    contentContainer.innerHTML = section.content;

    // Actualizar botones de navegación
    btnPrev.disabled = index === 0;
    btnPrev.style.visibility = index === 0 ? 'hidden' : 'visible';

    // Cambiar el texto del botón siguiente en la última página
    if (index === INFORMATION_SECTIONS.length - 1) {
        btnNext.textContent = 'Ir al consentimiento →';
        btnNext.classList.add('btn-to-consent'); // Clase para estilo naranja
    } else {
        btnNext.textContent = 'Siguiente →';
        btnNext.classList.remove('btn-to-consent');
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

function showIndexModal() {
    // Crear modal de índice
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'index-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content index-modal-content';

    let indexHTML = '<h3>Índice de la Hoja Informativa</h3><div class="index-list">';

    // Crear lista de secciones
    INFORMATION_SECTIONS.forEach((sectionKey, index) => {
        const section = INFORMATION_CONTENT[sectionKey];
        if (section.showInIndex) {
            indexHTML += `<div class="index-item" data-index="${index}">
                <span class="index-number">${index}.</span>
                <span class="index-title">${section.title}</span>
            </div>`;
        }
    });

    indexHTML += '</div>';
    indexHTML += '<div class="modal-buttons"><button id="close-index" class="btn btn-secondary">Cerrar</button></div>';

    modalContent.innerHTML = indexHTML;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Event listeners
    document.getElementById('close-index').addEventListener('click', () => {
        modal.remove();
    });

    // Click en cualquier elemento del índice
    document.querySelectorAll('.index-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            AppState.informationPageIndex = index;
            renderInformationSection(index);
            modal.remove();
        });
    });

    // Cerrar al hacer click fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function downloadInformationSheet() {
    // Abrir el PDF de la hoja informativa en una nueva ventana
    window.open('/docs/Hoja de información al paciente.pdf', '_blank');
}

// ============================================================================
// CONSENT PAGE
// ============================================================================

function setupConsentPage() {
    setupReadingSection();
    setupMainConsentSection();
    setupDecisionsSection();
    setupBiobankSection();
    setupSignatureSection();
}

// Sección 1: Lectura
function setupReadingSection() {
    const checkReadSheet = document.getElementById('check-read-sheet');
    const checkReceivedInfo = document.getElementById('check-received-info');
    const checkUnderstand = document.getElementById('check-understand');
    const btnNext = document.getElementById('btn-next-consent-1');
    const btnBackToInfo = document.getElementById('btn-back-to-info');
    const btnExit = document.getElementById('btn-exit-consent');

    checkReadSheet.addEventListener('change', () => {
        if (checkReadSheet.checked) {
            document.getElementById('question-1').classList.remove('hidden');
        } else {
            document.getElementById('question-1').classList.add('hidden');
            checkReceivedInfo.checked = false;
            document.getElementById('question-2').classList.add('hidden');
            checkUnderstand.checked = false;
        }
        updateNextButton1();
    });

    checkReceivedInfo.addEventListener('change', () => {
        if (checkReceivedInfo.checked) {
            document.getElementById('question-2').classList.remove('hidden');
        } else {
            document.getElementById('question-2').classList.add('hidden');
            checkUnderstand.checked = false;
        }
        updateNextButton1();
    });

    checkUnderstand.addEventListener('change', updateNextButton1);

    function updateNextButton1() {
        btnNext.disabled = !(checkReadSheet.checked && checkReceivedInfo.checked && checkUnderstand.checked);
    }

    btnNext.addEventListener('click', () => {
        AppState.consentData.consent.readInformationSheet = checkReadSheet.checked;
        AppState.consentData.consent.receivedInformation = checkReceivedInfo.checked;
        AppState.consentData.consent.understand = checkUnderstand.checked;

        hideAllConsentSections();
        document.getElementById('section-main-consent').classList.add('active');
    });

    btnBackToInfo.addEventListener('click', () => {
        navigateToPage('information-page');
    });

    btnExit.addEventListener('click', () => {
        if (confirm('¿Está seguro de que desea salir sin completar el consentimiento?')) {
            window.location.reload();
        }
    });
}

// Sección 2: Consentimiento principal
function setupMainConsentSection() {
    const checkMain1 = document.getElementById('check-main-1');
    const checkMain2 = document.getElementById('check-main-2');
    const btnNext = document.getElementById('btn-next-consent-2');
    const btnBack = document.getElementById('btn-back-consent-1');
    const btnExit = document.getElementById('btn-exit-consent-2');

    [checkMain1, checkMain2].forEach(check => {
        check.addEventListener('change', updateNextButton2);
    });

    function updateNextButton2() {
        btnNext.disabled = !(checkMain1.checked && checkMain2.checked);
    }

    btnNext.addEventListener('click', () => {
        AppState.consentData.consent.mainConsent1 = checkMain1.checked;
        AppState.consentData.consent.mainConsent2 = checkMain2.checked;

        hideAllConsentSections();
        document.getElementById('section-decisions').classList.add('active');
    });

    btnBack.addEventListener('click', () => {
        hideAllConsentSections();
        document.getElementById('section-reading').classList.add('active');
    });

    btnExit.addEventListener('click', () => {
        if (confirm('¿Está seguro de que desea salir sin completar el consentimiento?')) {
            window.location.reload();
        }
    });
}

// Sección 3: Decisiones
function setupDecisionsSection() {
    const geneticRadios = document.querySelectorAll('input[name="genetic-info"]');
    const biomarkersRadios = document.querySelectorAll('input[name="biomarkers"]');
    const btnNext = document.getElementById('btn-next-consent-3');
    const btnBack = document.getElementById('btn-back-consent-2');

    [...geneticRadios, ...biomarkersRadios].forEach(radio => {
        radio.addEventListener('change', updateNextButton3);
    });

    function updateNextButton3() {
        const geneticSelected = document.querySelector('input[name="genetic-info"]:checked');
        const biomarkersSelected = document.querySelector('input[name="biomarkers"]:checked');
        btnNext.disabled = !(geneticSelected && biomarkersSelected);
    }

    btnNext.addEventListener('click', () => {
        AppState.consentData.decisions.geneticInfo = document.querySelector('input[name="genetic-info"]:checked')?.value;
        AppState.consentData.decisions.biomarkers = document.querySelector('input[name="biomarkers"]:checked')?.value;

        hideAllConsentSections();
        document.getElementById('section-biobank').classList.add('active');
    });

    btnBack.addEventListener('click', () => {
        hideAllConsentSections();
        document.getElementById('section-main-consent').classList.add('active');
    });
}

// Sección 4: Biobanco
function setupBiobankSection() {
    const biobankActionRadios = document.querySelectorAll('input[name="biobank-action"]');
    const biobankDetails = document.getElementById('biobank-details');
    const donationTypeRadios = document.querySelectorAll('input[name="donation-type"]');
    const authorizedUseRadios = document.querySelectorAll('input[name="authorized-use"]');
    const btnNext = document.getElementById('btn-next-consent-4');
    const btnBack = document.getElementById('btn-back-consent-3');

    biobankActionRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'incorporar') {
                biobankDetails.classList.remove('hidden');
            } else {
                biobankDetails.classList.add('hidden');
            }
            updateNextButton4();
        });
    });

    [...donationTypeRadios, ...authorizedUseRadios].forEach(radio => {
        radio.addEventListener('change', updateNextButton4);
    });

    function updateNextButton4() {
        const actionSelected = document.querySelector('input[name="biobank-action"]:checked');

        if (!actionSelected) {
            btnNext.disabled = true;
            return;
        }

        if (actionSelected.value === 'destruir') {
            btnNext.disabled = false;
            return;
        }

        const donationSelected = document.querySelector('input[name="donation-type"]:checked');
        const useSelected = document.querySelector('input[name="authorized-use"]:checked');
        btnNext.disabled = !(donationSelected && useSelected);
    }

    btnNext.addEventListener('click', () => {
        const action = document.querySelector('input[name="biobank-action"]:checked')?.value;

        AppState.consentData.biobank.incorporation = action === 'incorporar';
        AppState.consentData.biobank.destruction = action === 'destruir';

        if (action === 'incorporar') {
            AppState.consentData.biobank.donationType = document.querySelector('input[name="donation-type"]:checked')?.value;
            AppState.consentData.biobank.authorizedUse = document.querySelector('input[name="authorized-use"]:checked')?.value;
        }

        hideAllConsentSections();
        document.getElementById('section-signature').classList.add('active');

        // Actualizar información del paciente en la sección de firma
        document.getElementById('patient-name-signature').textContent = `${AppState.userData.name} ${AppState.userData.lastName}`;
        document.getElementById('patient-dni-signature').textContent = AppState.userData.dni;
        document.getElementById('current-date').textContent = new Date().toLocaleDateString('es-ES');
    });

    btnBack.addEventListener('click', () => {
        hideAllConsentSections();
        document.getElementById('section-decisions').classList.add('active');
    });
}

// Sección 5: Firma
let signaturePad;

function setupSignaturePad() {
    const canvas = document.getElementById('signature-pad');
    const clearBtn = document.getElementById('btn-clear-signature');
    const submitBtn = document.getElementById('btn-submit-consent');
    const backBtn = document.getElementById('btn-back-consent-4');

    // Ajustar tamaño del canvas para dispositivos móviles
    if (window.innerWidth < 480) {
        canvas.width = 280;
        canvas.height = 150;
    }

    // Inicializar el lienzo de firma
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let hasSignature = false;

    // Funciones de dibujo
    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function draw(e) {
        if (!isDrawing) return;

        e.preventDefault();
        hasSignature = true;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineTo(x, y);
        ctx.stroke();

        submitBtn.disabled = false;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Event listeners para mouse
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Event listeners para touch (móviles)
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hasSignature = false;
        submitBtn.disabled = true;
    });

    submitBtn.addEventListener('click', async () => {
        if (!hasSignature) {
            alert('Por favor, firme antes de enviar');
            return;
        }

        if (!confirm('¿Está seguro de que desea enviar el consentimiento? Esta acción no se puede deshacer.')) {
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            // Guardar firma como imagen
            AppState.consentData.signature = canvas.toDataURL('image/png');
            AppState.consentData.timestamp = new Date().toISOString();
            AppState.consentData.dni = AppState.userData.dni;
            AppState.consentData.name = AppState.userData.name;
            AppState.consentData.lastName = AppState.userData.lastName;
            AppState.consentData.txprCode = AppState.userData.txprCode;

            // Enviar al servidor
            const response = await fetch('/api/consent/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(AppState.consentData)
            });

            const result = await response.json();

            if (result.success) {
                navigateToPage('completion-page');
                document.getElementById('txpr-code-display').textContent = AppState.userData.txprCode || 'N/A';
            } else {
                alert('Error al guardar el consentimiento. Por favor, inténtelo de nuevo.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión. Por favor, verifique su conexión e inténtelo de nuevo.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '✓ Enviar Consentimiento';
        }
    });

    backBtn.addEventListener('click', () => {
        hideAllConsentSections();
        document.getElementById('section-biobank').classList.add('active');
    });
}

function setupSignatureSection() {
    const downloadBtn = document.getElementById('btn-download-final-pdf');

    downloadBtn.addEventListener('click', async () => {
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Generando PDF...';

        try {
            const response = await fetch('/api/consent/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(AppState.consentData)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${AppState.userData.txprCode || 'consentimiento'}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Error al generar el PDF');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al descargar el PDF');
        } finally {
            downloadBtn.disabled = false;
            downloadBtn.textContent = '📥 Descargar PDF del Consentimiento';
        }
    });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function navigateToPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

function hideAllConsentSections() {
    document.querySelectorAll('.consent-section').forEach(section => {
        section.classList.remove('active');
    });
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}

function collectDeviceInfo() {
    AppState.consentData.deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timestamp: new Date().toISOString()
    };
}
