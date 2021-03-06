/**
 * Copyright 2016 Nathanaël Lécaudé
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

cson = require('cson');

module.exports = function(RED) {
    "use strict";
    function CSONNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;
        this.on("input", function(msg) {
            if (msg.hasOwnProperty("payload")) {
                if (typeof msg.payload === "string") {
                    try {
                        msg.payload = cson.parse(msg.payload);
                        node.send(msg);
                    }
                    catch(e) { node.error(e.message,msg); }
                }
                else if (typeof msg.payload === "object") {
                    if (!Buffer.isBuffer(msg.payload)) {
                        try {
                            msg.payload = cson.stringify(msg.payload);
                            node.send(msg);
                        }
                        catch(e) {
                            node.error(RED._("cson.errors.dropped-error"));
                        }
                    }
                    else { node.warn(RED._("cson.errors.dropped-object")); }
                }
                else { node.warn(RED._("cson.errors.dropped")); }
            }
            else { node.send(msg); } // If no payload - just pass it on.
        });
    }
    RED.nodes.registerType("cson",CSONNode);
};
