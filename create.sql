create table datas(
    id serial primary key,
    priority_data int not null,
    message_data text not null,
    timestamp_data timestamp not null default now()
);
