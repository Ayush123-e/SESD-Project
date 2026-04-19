import { BookRepository } from '../repositories/BookRepository';
import { BorrowingRepository } from '../repositories/BorrowingRepository';
import AppError from '../utils/AppError';
import { IBook } from '../models/Book';
import { FilterQuery } from 'mongoose';

export class BookService {
  constructor(
    private bookRepository: BookRepository = new BookRepository(),
    private borrowingRepository: BorrowingRepository = new BorrowingRepository()
  ) {}

  public async getAllBooks(queryParams: any = {}) {
    const { search, category, availability, sort, page = 1, limit = 12 } = queryParams;
    const query: FilterQuery<IBook> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { ISBN: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (availability === 'available') {
      query.availableQuantity = { $gt: 0 };
    }

    let sortParams: any = { createdAt: -1 };
    if (sort === 'popular') sortParams = { borrowCount: -1 };
    if (sort === 'newest') sortParams = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [books, total] = await Promise.all([
      this.bookRepository.findAll(query, skip, Number(limit), sortParams),
      this.bookRepository.countDocuments(query)
    ]);

    return {
      books,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      hasMore: (Number(page) * Number(limit)) < total
    };
  }

  public async getBookById(id: string): Promise<IBook> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new AppError('Book not found', 404);
    }
    return book;
  }

  public async createBook(bookData: Partial<IBook>): Promise<IBook> {
    const existingBook = await this.bookRepository.findByISBN(bookData.ISBN || '');
    if (existingBook) {
      throw new AppError('A book with this ISBN already exists', 400);
    }

    if (bookData.availableQuantity === undefined) {
      bookData.availableQuantity = bookData.quantity;
    }

    return await this.bookRepository.create(bookData);
  }

  public async updateBook(id: string, updateData: Partial<IBook>): Promise<IBook> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new AppError('Book not found', 404);
    }

    if (updateData.quantity !== undefined && updateData.quantity !== null) {
      const quantityDifference = updateData.quantity - book.quantity;
      updateData.availableQuantity = book.availableQuantity + quantityDifference;
      
      if (updateData.availableQuantity < 0) {
        throw new AppError('Cannot reduce total inventory below currently borrowed checkouts', 400);
      }
    }

    const updatedBook = await this.bookRepository.update(id, updateData);
    if (!updatedBook) throw new AppError('Configuration map failed', 500);
    return updatedBook;
  }

  public async getRecommendations(userId: string): Promise<IBook[]> {
    const favoriteCategory = await this.borrowingRepository.getMostBorrowedCategory(userId);
    
    let recommendations: IBook[] = [];
    if (favoriteCategory) {
       recommendations = await this.bookRepository.findAll({ availableQuantity: { $gt: 0 }, category: favoriteCategory }, 0, 4);
    }
    
    if (recommendations.length < 4) {
       const additionals = await this.bookRepository.findAll({ availableQuantity: { $gt: 0 } }, 0, 8);
       const ids = new Set(recommendations.map(r => r._id?.toString()));
       for (let b of additionals) {
          if (recommendations.length >= 4) break;
          const idStr = b._id?.toString();
          if (idStr && !ids.has(idStr)) {
             recommendations.push(b);
             ids.add(idStr);
          }
       }
    }
    return recommendations;
  }

  public async deleteBook(id: string): Promise<boolean> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new AppError('Book not found', 404);
    }
    
    if (book.availableQuantity < book.quantity) {
      throw new AppError('Cannot delete a book with checked-out copies actively remaining', 400);
    }

    return await this.bookRepository.delete(id);
  }
}

export default new BookService();
