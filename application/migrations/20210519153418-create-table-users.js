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
    db.createTable('users', {
        id: {type: dataType.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: dataType.STRING, notNull: true},
        password: {type: dataType.STRING, notNull: true},
        status: {type: dataType.INTEGER, defaultValue: 0, notNull: true},
        address: {type: dataType.STRING},
        tx_hash: {type: dataType.STRING},
        created_at: {type: dataType.DATE_TIME, notNull: true},
        updated_at: {type: dataType.DATE_TIME, notNull: true},
    });
    return null;
};

exports.down = function (db) {
    db.dropTable('users');
    return null;
};

exports._meta = {
    "version": 1
};
