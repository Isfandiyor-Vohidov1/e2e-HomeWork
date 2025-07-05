import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
  });

  afterEach(async () => {
    await dataSource.query('DELETE FROM "users"');
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Ali' })
      .expect(201);
  });

  it('/users (GET)', async () => {
    await request(app.getHttpServer()).get('/users').expect(200);
  });

  it('/users/:id (GET)', async () => {
    const inserted = await dataSource.query(
      `INSERT INTO "users" (name) VALUES ('Ali') RETURNING *`,
    );
    const id = inserted[0].id;

    await request(app.getHttpServer()).get(`/users/${id}`).expect(200);
  });

  it('/users/:id (PATCH)', async () => {
    const inserted = await dataSource.query(
      `INSERT INTO "users" (name) VALUES ('Ali') RETURNING *`,
    );
    const id = inserted[0].id;

    await request(app.getHttpServer())
      .patch(`/users/${id}`)
      .send({ name: 'Vali' })
      .expect(200);
  });

  it('/users/:id (DELETE)', async () => {
    const inserted = await dataSource.query(
      `INSERT INTO "users" (name) VALUES ('Ali') RETURNING *`,
    );
    const id = inserted[0].id;

    await request(app.getHttpServer()).delete(`/users/${id}`).expect(200);
  });
});
