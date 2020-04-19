import * as FileSystem from 'expo-file-system';

export const FILES ={
    FAVORITES: 'favorites.json',
    SETTINGS: 'settings.json'
}


export const saveToFileSystem = async(file, data, _callback) => {
    console.log(data);
    let jsonData = JSON.stringify(data);
    const path = `${FileSystem.documentDirectory}${file}`;
    const saving = await FileSystem.writeAsStringAsync(path, jsonData).then(() => {
        console.log(`Saved to ${file}`);
        _callback();
    }).catch((err) => {
        console.log(err);
    });
}

export const loadFromFileSystem = (file, _callback) => {
    const loadDir = FileSystem.readAsStringAsync(FileSystem.documentDirectory + file).then((value) => {
        _callback(JSON.parse(value));
    }).catch((err) => {
        let defaultData = '';
        if(file == FILES.SETTINGS){
            defaultData = {colorIndex: 0, tutorialCompleted: false}
        }
        if(file == FILES.FAVORITES){
            defaultData = [];
        }
        _callback(defaultData);
        FileSystem.writeAsStringAsync(FileSystem.documentDirectory + file, JSON.stringify(defaultData)).then((value) => {
            console.log(`created empty file ${file}`);
        }).catch((error) => {
            console.log(error);
        });
    });
}


export const deleteFile = async(file) => {
    const path = `${FileSystem.documentDirectory}${file}`;
    const saving = await FileSystem.deleteAsync(path).then(() => {
        console.log(`Deleted`);
    }).catch((err) => {
        console.log(err);
    });
}