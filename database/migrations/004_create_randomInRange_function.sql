create or replace function randomInRange(low double precision, high double precision) returns double precision
    language sql
    immutable
    returns null on null input
    return random() * (high - low) + low;