ALTER TABLE "Review"
ADD CONSTRAINT "Review_rating_check"
CHECK ("rating" >= 1 AND "rating" <= 5);

ALTER TABLE "Tip"
ADD CONSTRAINT "Tip_amount_check"
CHECK ("amount" > 0 AND "amount" <= 1000000);