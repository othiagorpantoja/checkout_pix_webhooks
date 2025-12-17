import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm'

@Entity({ name: 'webhook_targets' })
export class TargetEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index({ unique: true })
  @Column({ type: 'text' })
  url!: string

  @Column({ type: 'text', nullable: true })
  secret?: string | null
}
