var exec = require('child_process').exec;

    // function User(callback){
    //     exec('node -v', function (error, stdout, stderr) {
    //         console.log(command + 't');
    //         console.log('stdoutt: ' + stdout);
    //         console.log('stderr: ' + stderr);
    //         if (error !== null) {
    //             console.log('exec error: ' + error);
    //             //return stderr
    //         }
    //         return callback(null, stdout)
    //     });
    // }

const foo = async function(cmd, cb){
    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            return cb(null, stderr);
        }
        cb(stdout, null);
    });

};

module.exports = foo;
