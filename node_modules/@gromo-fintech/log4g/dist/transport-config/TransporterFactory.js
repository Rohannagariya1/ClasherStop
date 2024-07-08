"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportConfiguratorFactory = void 0;
const TransporterType_enum_1 = require("./enums/TransporterType.enum");
const TransportConfiguratorBasic_1 = require("./TransportConfiguratorBasic");
const TransportConfiguratorWithBifurcation_1 = require("./TransportConfiguratorWithBifurcation");
class TransportConfiguratorFactory {
    generate(type) {
        switch (type) {
            case TransporterType_enum_1.TransporterType.SINGLE_FILE:
                return new TransportConfiguratorBasic_1.TransportConfiguratorBasic();
            case TransporterType_enum_1.TransporterType.BIFIRUCATED_BY_LOG_LEVEL:
                return new TransportConfiguratorWithBifurcation_1.TransportConfiguratorWithBifurcation();
            default:
                return new TransportConfiguratorBasic_1.TransportConfiguratorBasic();
        }
    }
}
exports.TransportConfiguratorFactory = TransportConfiguratorFactory;
