import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Status } from '../../shared/entity-status.enum';
import { In } from 'typeorm';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { Book } from './book.entity';
import { BookRepository } from './book.repository';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dtos';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookRepository)
        private readonly _bookRepository: BookRepository,
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
    ){}

    async get(bookId: number): Promise<ReadBookDto> {
        if (!bookId) {
            throw new BadRequestException('el id es requerido');
        }

        const book: Book = await this._bookRepository.findOne(bookId);

        if (!book) {
            throw new NotFoundException('El libro no existe');
        }

        return plainToClass(ReadBookDto, book);
    }

    async getAll(): Promise<ReadBookDto[]> {
        const books: Book[] = await this._bookRepository.find();
        return books.map(book => plainToClass(ReadBookDto, book));
    }

    async getBookByAuthors(authorId: number): Promise<ReadBookDto[]> {
        if (!authorId) {
            throw new BadRequestException('el autor es requerido');
        }
        const books: Book[] = await this._bookRepository.find({
            where: { authors: In([authorId]) }
        });
        return books.map(book => plainToClass(ReadBookDto, book));
    }

    async createBook(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
        const authors: User[] = [];

        for (const authorId of book.authors) {
            const authorExist = await this._userRepository.findOne(authorId, {
                where: {status: Status.ACTIVE}
            });

            if(!authorExist){
                throw new NotFoundException('El autor con el id ' + authorId + ' no existe');
            }

            const isAuthor = authorExist.roles.some(
                (role: Role) => role.name === RoleType.AUTHOR
            );

            if(!isAuthor){
                throw new UnauthorizedException('El usuario con el id ' + authorId + ' no es un autor');
            }

            authors.push(authorExist);
        }

        const savedBook: Book = await this._bookRepository.save({
            title: book.title,
            description: book.description,
            authors
        });

        return plainToClass(ReadBookDto, savedBook);
    }

    async createBookByAuthor(book: Partial<CreateBookDto>, authorId: number): Promise<ReadBookDto> {
        const authorExist: User = await this._userRepository.findOne(authorId, {
            where: {status: Status.ACTIVE}
        });

        if(!authorExist){
            throw new NotFoundException('El autor con el id ' + authorId + ' no existe');
        }

        const isAuthor = authorExist.roles.some(
            (role: Role) => role.name === RoleType.AUTHOR
        );

        if(!isAuthor){
            throw new UnauthorizedException('El usuario con el id ' + authorId + ' no es un autor');
        }

        const savedBook: Book = await this._bookRepository.save({
            title: book.title,
            description: book.description,
            authorExist
        });

        return plainToClass(ReadBookDto, savedBook);
    }

    async updateBookByAuthor(bookId: number, book: Partial<UpdateBookDto>, authorId: number): Promise<ReadBookDto> {
        const authorExist: User = await this._userRepository.findOne(authorId, {
            where: {status: Status.ACTIVE}
        });

        if(!authorExist){
            throw new NotFoundException('El autor con el id ' + authorId + ' no existe');
        }

        const isAuthor = authorExist.roles.some(
            (role: Role) => role.name === RoleType.AUTHOR
        );

        if(!isAuthor){
            throw new UnauthorizedException('El usuario con el id ' + authorId + ' no es un autor');
        }

        const bookExist: Book = await this._bookRepository.findOne(bookId);

        if(!bookExist){
            throw new NotFoundException('El libro no existe');
        }

        const isOwnBook = bookExist.authors.some(author => author.id === authorId);

        if(!isOwnBook){
            throw new UnauthorizedException('El autor no es el propietario del libro');
        }

        const updatedBook = this._bookRepository.update(bookId, book);

        return plainToClass(ReadBookDto, updatedBook);
    }

    async deleteBook(bookId: number): Promise<void> {
        const bookExist: Book = await this._bookRepository.findOne(bookId);

        if(!bookExist){
            throw new NotFoundException('El libro no existe');
        }

        await this._bookRepository.update(bookId, {status: Status.INACTIVE});
    }

}
