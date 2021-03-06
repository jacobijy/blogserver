/**
 * 给所有的 Model 扩展功能
 * http://mongoosejs.com/docs/plugins.html
 */
import { formatDate } from '../utils/tools';
import { Schema } from 'mongoose';

const BaseModel = (schema: Schema) => {
    schema.methods.create_at_ago = function() {
        return formatDate(this.create_at, true);
    };

    schema.methods.update_at_ago = function() {
        return formatDate(this.update_at, true);
    };
};

export default BaseModel;
