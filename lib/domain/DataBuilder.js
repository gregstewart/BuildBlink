
var dataBuilder = {
    normalize: function (data, type) {
        var result = {},
            current,
            previous,
            token;

        if (type === 'TeamCity') {
            current = data.build[0];
            previous = data.build[1];
            token = current.buildTypeId + ':' + current.id;
        } else {
            current = data.builds[0];
            previous = data.builds[1];
            token = current.id;
        }

        current.status = current.status.toLowerCase();
        previous.status = previous.status.toLowerCase();

        result = {
            current: current,
            previous: previous,
            buildToken: token
        };

        return  result;
    }
};

module.exports = dataBuilder;