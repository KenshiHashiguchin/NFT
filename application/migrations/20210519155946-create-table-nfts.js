'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */

const dataType = require('db-migrate-shared').dataType;

exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    db.createTable('nfts', {
        id: {type: dataType.INTEGER, primaryKey: true, autoIncrement: true},
        status: {type: dataType.INTEGER, notNull: true}, // 0:未承認 1:承認済 2:失敗（必要かわからんが）
        type: {type: dataType.STRING, defaultValue: 'img', notNull: true}, //img, movie, mp4?

        token: {type: dataType.STRING}, //モザイクID

        //モザイクメタデータに含まれる内容 もしかすると必要ない
        title: {type: dataType.STRING, notNull: true},
        description: {type: dataType.STRING},
        hash: {type: dataType.STRING},

        created_at: {type: dataType.DATE_TIME, notNull: true},
    });
    return null;
};

exports.down = function (db) {
    db.dropTable('nfts');
    return null;
};

exports._meta = {
    "version": 1
};
