const adminPassword = 'igormaria2027';

function initAdminPanel() {
    const adminBtn = document.getElementById('adminBtn');
    const adminPanel = document.getElementById('adminPanel');
    const closeAdmin = document.getElementById('closeAdmin');
    const loginBtn = document.getElementById('adminLoginBtn');
    const passInput = document.getElementById('adminPassInput');
    
    adminBtn.addEventListener('click', () => {
        adminPanel.classList.toggle('open');
    });
    
    closeAdmin.addEventListener('click', () => {
        adminPanel.classList.remove('open');
    });
    
    loginBtn.addEventListener('click', () => {
        if (passInput.value === adminPassword) {
            document.getElementById('adminPassword').style.display = 'none';
            document.getElementById('adminContent').style.display = 'block';
            loadAdminEntries();
        } else {
            showNotification('❌ Неверный пароль!', 'error');
            passInput.value = '';
        }
    });
    
    passInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') loginBtn.click();
    });
}

function loadAdminEntries() {
    const list = document.getElementById('entriesList');
    const total = document.getElementById('totalEntries');
    const confirmed = document.getElementById('adminConfirmed');
    const declined = document.getElementById('adminDeclined');
    
    list.innerHTML = '';
    let conf = 0, dec = 0;
    
    entries.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'entry-item';
        item.innerHTML = `
            <strong>${entry.name}</strong> (${entry.count})<br>
            <small>${new Date(entry.timestamp).toLocaleString('ru-RU')}</small><br>
            <span style="color: ${entry.attendance === 'yes' ? '#27ae60' : '#e74c3c'}">
                ${entry.attendance === 'yes' ? '✅ Придёт' : '❌ Отказался'}
            </span><br>
            ${entry.diet ? `Диета: ${entry.diet}<br>` : ''}
            <em>${entry.wishes}</em>
        `;
        list.appendChild(item);
        
        if (entry.attendance === 'yes') conf++;
        else if (entry.attendance === 'no') dec++;
    });
    
    total.textContent = entries.length;
    confirmed.textContent = conf;
    declined.textContent = dec;
}

function initExportExcel() {
    const exportBtn = document.getElementById('exportExcelBtn');
    exportBtn.addEventListener('click', () => {
        let csv = 'Имя,Гостей,Участие,Диета,Пожелания,Дата\n';
        
        entries.forEach(entry => {
            csv += `"${entry.name}","${entry.count}","${entry.attendance}","${entry.diet || ''}","${entry.wishes.replace(/"/g, '""')}","${new Date(entry.timestamp).toLocaleString('ru-RU')}"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `wedding-rsvp-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('📥 Excel готов!');
    });
}

function initClearEntries() {
    document.getElementById('clearAllBtn').addEventListener('click', () => {
        if (confirm('🗑️ Очистить ВСЕ записи?')) {
            entries = [];
            localStorage.removeItem('weddingEntries');
            confirmedCount = 0;
            updateGuestCounter();
            loadAdminEntries();
            showNotification('🗑️ Все записи очищены!');
        }
    });
}

// Инициализация админки
document.addEventListener('DOMContentLoaded', () => {
    initAdminPanel();
    initExportExcel();
    initClearEntries();
});
