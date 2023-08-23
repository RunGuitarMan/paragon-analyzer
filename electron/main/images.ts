// import screenshot from "screenshot-desktop";

// ipcMain.handle('get-images', () => {
//     return new Promise<any>((resolve, reject) => {
//
//         // desktopCapturer.getSources({types: ["screen"], thumbnailSize: { width: 1920, height: 1090}}).then((response) => {
//         getImage().then((response) => {
//             const primaryDisplay = screen.getPrimaryDisplay()
//
//             const widthPoss = Math.round(5 / 100 * primaryDisplay.size.width);
//             const heightPoss = Math.round(88 / 100 * primaryDisplay.size.height);
//
//             return resolve({
//                 image: response,
//                 width: widthPoss,
//                 height: Math.round(12 / 100 * primaryDisplay.size.height),
//                 x: primaryDisplay.size.width - widthPoss,
//                 y: heightPoss
//             });
//
//             // response.forEach(r => {
//             //     console.log(2)
//             //     return resolve({
//             //         image: r.thumbnail.toDataURL(),
//             //         width: widthPoss,
//             //         height: Math.round(12 / 100 * primaryDisplay.size.height),
//             //         x: primaryDisplay.size.width - widthPoss,
//             //         y: heightPoss
//             //     });
//             // })
//         }, error => {
//             console.log(error)
//
//             return null;
//         })
//     })
// })
//
// const getImage = async () => {
//     return await screenshot({ format: "png"});
// };