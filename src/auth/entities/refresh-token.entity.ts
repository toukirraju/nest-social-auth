import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @ManyToOne(() => User, (user) => user.refreshTokens)
    @JoinColumn({ name: 'userId' })  // Add this line
    user: User;

    @Column()  // Add this line
    userId: number;

    @Column()
    expiresAt: Date;

    @Column({ default: false })
    used: boolean;

    @Column({ default: false })
    revoked: boolean;
}