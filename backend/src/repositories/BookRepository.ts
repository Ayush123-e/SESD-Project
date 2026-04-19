import Book, { IBook } from '../models/Book';
import { IBaseRepository } from './IBaseRepository';
import { FilterQuery, UpdateQuery } from 'mongoose';

export class BookRepository implements IBaseRepository<IBook> {
  async findById(id: string): Promise<IBook | null> {
    return await Book.findById(id);
  }

  async findOne(filter: FilterQuery<IBook>): Promise<IBook | null> {
    return await Book.findOne(filter);
  }

  async find(filter: FilterQuery<IBook> = {}): Promise<IBook[]> {
    return await Book.find(filter);
  }

  async create(bookData: Partial<IBook>): Promise<IBook> {
    const book = new Book(bookData);
    return await book.save();
  }

  async update(id: string, updateData: UpdateQuery<IBook>): Promise<IBook | null> {
    return await Book.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Book.findByIdAndDelete(id);
    return !!result;
  }

  // Domain specifics
  async findAll(query: FilterQuery<IBook> = {}, skip: number = 0, limit: number = 0, sortParams: string | Record<string, 1 | -1> = { createdAt: -1 }): Promise<IBook[]> {
    let qs = Book.find(query).sort(sortParams);
    if (skip) qs = qs.skip(skip);
    if (limit) qs = qs.limit(limit);
    return await qs;
  }

  async countDocuments(query: FilterQuery<IBook> = {}): Promise<number> {
    return await Book.countDocuments(query);
  }

  async findByISBN(isbn: string): Promise<IBook | null> {
    return await Book.findOne({ ISBN: isbn });
  }

  async countTotalTitles(): Promise<number> {
    return await Book.countDocuments();
  }
}

export default new BookRepository();
