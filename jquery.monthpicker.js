;(function ($) {

	var MonthPicker = function(options) {
		// default options
		var defaultOptions = {
			$el: $('input'),
			year: 2014,
			month: 1,
			maxDate: new Date(),
			minDate: new Date(2012, 0, 1),
			monthName: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			onSelected: function(year, month) {}
		};

		var temp = $.extend(defaultOptions, options);
		$.extend(this, temp);
		this.init();
	}

	MonthPicker.prototype = {
		init: function() {
			this._initDom();
			this._bindEvent();
		},

		_initDom: function() {
			var that = this
				, minYear = this.minDate.getFullYear()
				, maxYear = this.maxDate.getFullYear()
				;

			this.$wrap = $('<div class="month-picker-wrap"></div>');
			this.$selectWrap = $('<div class="year-select"></div>');
			this.$select = $('<select></select>');
			this.$months = $('<ul class="months"></ul>');

			for(var year = minYear; year <= maxYear; year++) {
				var $op = $('<option value="'+ year +'">'+ year +'</option>');
				this.$select.append($op);
			}

			$.each(this.monthName, function (index, month) {
				var $li = $('<li></li>');
				$li.data('value', index + 1).text(month);
				that.$months.append($li);
			});

			this.$selectWrap.append(this.$select);
			this.$wrap.append(this.$selectWrap).append(this.$months);

			$('body').append(this.$wrap);

			var initDate = this.$el.val().split('-');
			if(initDate.length == 2) {
				this.year = parseInt(initDate[0]);
				this.month = parseInt(initDate[1]);
			}

			this.setDate(this.year, this.month);

		},

		_bindEvent: function() {
			var that = this;

			that.$el.on('click', function(e) {
				var offset = that.$el.offset();

				that.$wrap.css({
					top: offset.top + that.$el.height() + 3,
					left: offset.left
				});
				that._updateDom();
				that.$wrap.show();

			});

			that.$select.on('change', function() {
				that._updateDom(parseInt($(this).val()));
			});

			$('body').on('click', function(e) {
				if(e.target != that.$select[0] &&
					e.target != that.$wrap[0] &&
					e.target != that.$el[0]) {
					that.$wrap.hide();
				}
			});

			this.$months.on('click', 'li', function() {
				if($(this).hasClass('disable')) return;
				that.setDate(parseInt(that.$select.val()), $(this).data('value'), true);
				that.$wrap.hide();
			});
		},

		_updateDom: function(year, month) {
			var that = this
				, minYear = this.minDate.getFullYear()
				, maxYear = this.maxDate.getFullYear()
				, minMonth = this.minDate.getMonth() + 1
				, maxMonth = this.maxDate.getMonth() + 1
				;

			year = year || this.year;
			month = month || this.month;

			that.$select.empty();
			for(var y = minYear; y <= maxYear; y++) {
				var $op = $('<option value="'+ y +'">'+ y +'</option>');
				this.$select.append($op);
			}
			that.$select.val(year);

			that.$months.find('li').each(function() {
				var m = $(this).data('value');

				if((year === minYear && m < minMonth )|| (year === maxYear && m > maxMonth)) {
					$(this).addClass('disable').removeClass('selected');
					return this;
				}

				if( m === month ) {
					that.$months.not($(this)).removeClass('selected');
					$(this).removeClass('disable').addClass('selected');

					return this;
				}

				$(this).removeClass('disable selected')
			});

		},

		_parseMonth: function(month) {
			return parseInt(month) < 10 ? ('0' + month) : month;
		},

		setDate: function(year, month, fireEvent) {
			this.year = year;
			this.month = month;
			this.$el.val(this.year + '-' + this._parseMonth(this.month));
			if(typeof this.onSelected === 'function' && fireEvent) {
				this.onSelected.call(this, this.year, this.month);
			}
		},

		getDate: function() {
			return {year: this.year, month: this.month};
		}

	};

	$.fn.monthpicker = function (options) {
		options && (options.$el = this);

		return new MonthPicker(options);

	}

})(jQuery);