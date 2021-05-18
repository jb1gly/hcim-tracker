import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("player")
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rsn: string;

  @Column()
  mode: string;

  @Column()
  deironed: boolean;

  @Column()
  dead: boolean;

  @Column({ type: "text" })
  skills: string;

  @Column({ type: "text" })
  clues: string;

  @Column({ type: "text" })
  bosses: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
