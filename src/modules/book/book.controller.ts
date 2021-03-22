import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/user.decorator';
import { Roles } from '../role/decorator/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';
import { BookService } from './book.service';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dtos';

@Controller('book')
export class BookController {
    constructor(protected readonly _bookService: BookService){}

    @Get(':bookId')
    getBook(@Param('bookId', ParseIntPipe) bookId: number): Promise<ReadBookDto>{
        return this._bookService.get(bookId);
    }

    @Get('/author/:authorId')
    getBooksByAuthor(@Param('authorId', ParseIntPipe) authorId: number): Promise<ReadBookDto[]>{
        return this._bookService.getBookByAuthors(authorId);
    }

    @Get()
    getBooks(): Promise<ReadBookDto[]>{
        return this._bookService.getAll();
    }

    @Post()
    @UseGuards(AuthGuard())
    createBook(@Body() book: Partial<CreateBookDto>): Promise<ReadBookDto> {
        return this._bookService.createBook(book);
    }

    @Post('/author')
    @Roles(RoleType.AUTHOR)
    @UseGuards(AuthGuard(), RoleGuard)
    createBookByAuthor(@Body() book: Partial<CreateBookDto>, @GetUser('id') authorId: number): Promise<ReadBookDto> {
        return this._bookService.createBookByAuthor(book, authorId);
    }

    @Patch(':bookId')
    updateBook(@Param('bookId', ParseIntPipe) bookId: number, @Body() book: Partial<UpdateBookDto>, @GetUser('id') authorId: number): Promise<ReadBookDto> {
        return this._bookService.updateBookByAuthor(bookId, book, authorId);
    }

    @Delete(':id')
    deleteBook(@Param('bookId', ParseIntPipe) bookId: number): Promise<void>{
        return this._bookService.deleteBook(bookId);
    }
}
