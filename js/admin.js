const adminPassword = 'igormaria2027';

let entries = JSON.parse(localStorage.getItem('weddingEntries') || '[]');

document.addEventListener('DOMContentLoaded', function() {
    initAdminPanel();
    initExportExcel();
    initClearEntries();
});

function initAdminPanel() {
    const adminBtn = document.getElementById('adminBtn');
    const adminPanel = document.getElementById('adminPanel');
    const closeAdmin = document.getElementById('closeAdmin');
    const loginBtn = document.getElementById('adminLoginBtn');
    const passInput = document.getElementById('adminPassInput');

    if (!adminBtn || !adminPanel) return;

    adminBtn.addEventListener('click', () => {
        adminPanel.classList.toggle('open');
    });

    if (closeAdmin) {
        closeAdmin.addEventListener('click', () => {
            adminPanel.classList.remove('open');
        });
    }

    if (loginBtn && passInput) {
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
}

function loadAdminEntries() {
    const list = document.getElementById('entriesList');
    const total = document.getElementById('totalEntries');
    const confirmed = document.getElementById('adminConfirmed');
    const declined = document.getElementById('adminDeclined');

    if (!list || !total) return;

    list.innerHTML = '';
    let conf = 0, dec = 0;

    entries.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'entry-item';
        item.innerHTML = `
            <strong>${entry.name}</strong> (${entry.count})<br>
            <small>${new Date(entry.timestamp).toLocaleString('ru-RU')}</small><br>
            <span style="color: ${entry.attendance === 'yes' ? '#27ae60' : '#e74c3c'}">
                ${entry.attendance === 'yes' ? '✅ Придет' : '❌ Не придет'}
            </span><br>
            ${entry.diet ? `Диета: ${entry.diet}<br>` : ''}
            <em>${entry.wishes || 'Без пожеланий'}</em>
        `;
        list.appendChild(item);

        if (entry.attendance === 'yes') conf++;
        else if (entry.attendance === 'no') dec++;
    });

    if (total) total.textContent = entries.length;
    if (confirmed) confirmed.textContent = conf;
    if (declined) declined.textContent = dec;
}

function initExportExcel() {
    const exportBtn = document.getElementById('exportExcelBtn');
    if (!exportBtn) return;

    exportBtn.addEventListener('click', () => {
        let csv = 'Имя,Гостей,Участие,Диета,Пожелания,Дата\n';
        entries.forEach(entry => {
            csv += `"${entry.name}","${entry.count}","${entry.attendance}","${entry.diet || ''}","${(entry.wishes || '').replace(/"/g, '""')}","${new Date(entry.timestamp).toLocaleString('ru-RU')}"\n`;
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
        showNotification('✅ Excel скачан!');
    });
}

function initClearEntries() {
    const clearBtn = document.getElementById('clearAllBtn');
    if (!clearBtn) return;

    clearBtn.addEventListener('click', () => {
        if (confirm('🗑️ Очистить ВСЕ записи? Это нельзя отменить!')) {
            entries = [];
            localStorage.removeItem('weddingEntries');
            confirmedCount = 0;
            updateGuestCounter();
            loadAdminEntries();
            showNotification('🗑️ Все записи удалены!');
        }
    });
}

// Функция для совместимости с main.js
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        setTimeout(() => notification.classList.remove('show'), 4500);
    }
}
