const notyf = new Notyf({
    types: [
        {
            type: 'info',
            background: '#2196f3', // blue
            icon: {
                className: 'material-icons',
                tagName: 'i',
            },
            duration: 3000
        }
    ]
});


const notyfSuccess = (msg) => notyf.success(msg);
const notyfError = (msg) => notyf.error(msg);
const notyfInfo = (msg) => notyf.open({ type: "info", message: msg });

export { notyfSuccess, notyfError, notyfInfo };