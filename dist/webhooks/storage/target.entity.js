var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
let TargetEntity = class TargetEntity {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], TargetEntity.prototype, "id", void 0);
__decorate([
    Index({ unique: true }),
    Column({ type: 'text' }),
    __metadata("design:type", String)
], TargetEntity.prototype, "url", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TargetEntity.prototype, "secret", void 0);
TargetEntity = __decorate([
    Entity({ name: 'webhook_targets' })
], TargetEntity);
export { TargetEntity };
//# sourceMappingURL=target.entity.js.map