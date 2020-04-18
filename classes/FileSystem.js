import * as FileSystem from 'expo-file-system';


export const saveToFileSystem = async(id, _callback) => {
    let name = "favorites/" + id
    const path = `${FileSystem.documentDirectory}${name}`;
    const saving = await FileSystem.writeAsStringAsync(path, id).then(() => {
        console.log('Saved Favorite');
        _callback();

    }).catch((err) => {
        console.log(err);
    });
}

export const saveSettings = async(data) => {
    let name = 'settings.json'
    const path = `${FileSystem.documentDirectory}${name}`;
    const saving = await FileSystem.writeAsStringAsync(path, data).then(() => {
        console.log('Saved Settings');
    }).catch((err) => {
        console.log(err);
    });
}

export const loadSettings = (_callback) => {
    const loadDir = FileSystem.readAsStringAsync(FileSystem.documentDirectory + "settings.json").then((value) => {
        _callback(value);
    }).catch((err) => {
        FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "settings.json", JSON.stringify({colorIndex: 0})).then((value) => {
            console.log(value);
        }).catch((error) => {
            console.log(error);
        });
    });
}

export const deleteFromFileSystem = async(id, _callback) => {
    const load = FileSystem.deleteAsync(FileSystem.documentDirectory + "favorites/" + id).then((value) => {
        // console.log(value);
        _callback();
    }).catch((err) => {
        console.log(err);
    });
};

export const loadFromFileSystem = (_callback) => {
    const loadDir = FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "favorites/").then((value) => {
        _callback(value);
    }).catch((err) => {
        FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "favorites/").then((value) => {
            console.log(value);
        }).catch((error) => {
            console.log(error);
        });
    });
}