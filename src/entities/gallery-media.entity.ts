import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GalleryMediaKind } from './enums';

@Entity('gallery_media')
export class GalleryMediaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: GalleryMediaKind })
  kind: GalleryMediaKind;

  /** Titre / label affiché sur le site. */
  @Column({ type: 'varchar', length: 255 })
  title: string;

  /** Chemin local (/uploads/...) ou URL externe. */
  @Column({ type: 'varchar', length: 500 })
  src: string;

  /** Optionnel: image de preview/affiche pour les vidéos. */
  @Column({ type: 'varchar', length: 500, nullable: true })
  poster: string | null;

  @Index()
  @Column({ default: true })
  isActive: boolean;

  /** Ordre d’affichage (croissant). */
  @Index()
  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

