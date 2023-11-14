const courseForm = document.getElementById('course-form');

courseForm.addEventListener('submit', function (e) {
    e.preventDefault();
    handleSubmit();
});

const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl:
        'https://gist.github.com/anovic123/9ff99c31c8e7e8a4d981ffc78ac81588.txt',
});

const tonweb = new window.TonWeb();

// const connector = new TonConnectSDK.TonConnect();

// connector.restoreConnection();

const telegramInput = document.getElementById('telegram-input');
const telegramErrorText = document.getElementById('telegram-error-text');

telegramInput.addEventListener('input', validateTelegram);

function validateTelegram() {
    const nameValue = document.getElementById('name-input').value;
    const usernameValue = telegramInput.value;

    if (nameValue.trim() === '' || usernameValue.trim() === '') {
        telegramInput.classList.add('error');
        telegramErrorText.textContent = 'Заполните все поля';
        return false;
    } else if (usernameValue.includes('@')) {
        telegramInput.classList.remove('error');
        telegramErrorText.textContent = '';
        return true;
    } else {
        telegramInput.classList.add('error');
        telegramErrorText.textContent = 'Введите корректный ник';
        return false;
    }
}

async function getTransactionBuild (username) {

    let a = new tonweb.boc.Cell();
    a.bits.writeUint(0, 32);
    a.bits.writeString(username);
    let payload = tonweb.utils.bytesToBase64(await a.toBoc());

    return {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
        messages: [
            {
                address: "UQAXT2kFyCKUT9Hz8tpgbPo8-Qturr_tp_ynSO4juL6N4omn",
                amount: '50000000000',
                payload: payload,
            },
        ],
    }
}

async function handleSubmit() {
    if (!validateTelegram()) {
        return;
    }

    const formData = new FormData(courseForm);
    const name = formData.get('name');
    const username = formData.get('username');

    try {
        // await tonConnectUI.disconnect();
    } catch (error) {
        console.log('error disconnect', error)
    }

    
    // console.log('conn', connector)

    if (!tonConnectUI.connected) {

        const connectedWallet = await tonConnectUI.connectWallet();
        console.log(connectedWallet);
    } else {
        const connectedWallet = tonConnectUI.wallet
        console.log(connectedWallet);
    }

    const transaction = await getTransactionBuild(username)

    try {

        const result = await tonConnectUI.sendTransaction(transaction);

        alert('Успешно оплачено, скоро вам пришлют приглашение.')

        // await tonConnectUI.disconnect();
    } catch (error) {
        if (error) {
            console.log(error)
            alert(
                'Ошибка, возможно недостаточно средств на кошельке',
            );
        } else {
            alert('Неизвестная ошибка', error);
        }

        
    }

    
    fetch('https://scenic-helper-401908.de.r.appspot.com/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username }),
    })
    .then(() => {
        courseForm.reset();
    })
    .catch((error) => {
        console.error(error);
    });

    // await tonConnectUI.disconnect();
}
