select * from users;

select * from proposals;


select * from projects;

delete from projects;

select * from jobs;


select * from notifications;

update proposals
set status='pending';

ALTER TABLE jobs ADD COLUMN domain VARCHAR(255);
